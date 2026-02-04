

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext";
import Cards from "../komponente/SmestajneJedinice"
const PrikazivanjeSmestaja = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [Dvoriste, setDvoriste] = useState("Da");
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [nazivSmestaja, setNazivSmestaja] = useState("");
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();
    let prvi = true;
    const [smestaj, setSmestaj] = useState({
        naziv: "",
        udaljenostOdCentra: "",
        brojSoba: "",
        naseljeIme: "",
        ulica:"",
        dvoriste: "",
        brojParkingMesta: "",
        prosecnaOcena: 0
    });
    const location = useLocation();
    const segment = location.pathname.split('/').pop();
    let lastSegment = null
    async function getSmestaj() {
        try {
            if(lastSegment!=null)
            {
            const response = await fetch('/api/SmestajRuta/detalji/' + lastSegment);
            if (response.ok) {
                const data = await response.json();
                setSmestaj(data);
                setNazivSmestaja(lastSegment);
                dispatch({ type: 'GET_SMESTAJ', payload: data });
            } else {
                console.error('Greška pri dobijanju smestaja');
            }}
        } catch (error) {
            console.error('Greška pri dobijanju smestaja:', error);
        }
    }
    
    useEffect(() => {
        
        lastSegment = decodeURIComponent(segment);
        if(lastSegment!=null){
        getSmestaj();     
    }

    }, [location,dispatch]);


    const fetchSmestaj = async () => {
        if (lastSegment != null) {
            const response = await fetch(`/api/SmestajRuta/detalji/${lastSegment}`);
            if (response.ok) {
                const data = await response.json();
                setSmestaj(data);
                setNazivSmestaja(lastSegment);
                dispatch({ type: 'GET_SMESTAJ', payload: data });
            } else {
                console.error('Greška pri dobijanju smestaja');
            }
        }
    };
    
    const handleReviewSubmit = async (reviewData) => {
        try {
            const response = await fetch('/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });
    
            if (response.ok) {
                fetchSmestaj(); // Re-fetch accommodation details to get updated rating
            } else {
                console.error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const clearErrorMessage = () => {
        setErrorMessage('');
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map((file) =>
                URL.createObjectURL(file)
            );
            setSelectedImages((prevImages) => prevImages.concat(filesArray));
            Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
        }
    };

    const removeImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(newImages);
        if (currentImageIndex >= newImages.length) {
            setCurrentImageIndex(newImages.length - 1);
        }
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : selectedImages.length - 1));
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex < selectedImages.length - 1 ? prevIndex + 1 : 0));
    };

    const handleAddUnitClick = () => {
        navigate('/stanodavac/smestaj/'+lastSegment+'/dodajSmestajnuJedinicu');
    };

    return (
        <div className="gost-smestaj">     
            <h1>{smestaj.naziv}</h1>       
            <div> 
                <p><strong>Mesto:</strong> {smestaj.naseljeIme+', '+smestaj.ulica }</p>
                <p><strong>Broj smestajnih jedinica:</strong> {smestaj.brojSoba}</p>
                <p><strong>Udaljenost od centra:</strong> {smestaj.udaljenostOdCentra}</p>
                <p><strong>Dvoriste:</strong> {smestaj.dvoriste ? "Da":"Ne"}</p>
                <p><strong>Broj Parking mesta:</strong> {smestaj.brojParkingMesta}</p>  
                <p><strong>Ocena:</strong> {smestaj.prosecnaOcena}</p>
            </div>                        
        </div>
    );
}
export default PrikazivanjeSmestaja;