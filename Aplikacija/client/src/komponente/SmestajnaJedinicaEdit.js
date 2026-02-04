// PrikazivanjeSmestaja.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext";


const PrikazivanjeSmestaja = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [Dvoriste, setDvoriste] = useState("Da");

    const [Kuhinja,setKuhinja] = useState("Da");
    const [WIFI,setWifi] = useState("Da");
    const [TV,setTv] = useState("Da");
    const [Terasa,setTerasa] = useState("Da");
    let imeJed=""
    let imeSme=""
    let get = false
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [nazivSmestaja, setNazivSmestaja] = useState("");
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();
    const [smestajnaJedinica, setSmestajnaJedinica] = useState({
        imeSmestaja: "",
        imeJedinice: "",
        brojSobe: 0,
        klima: "",
        brojKreveta: 0,
        kuhinja: "",
        wifi: "",
        tv: "",
        terasa: ""
      });
    const location = useLocation();
    const regex = /\/stanodavac\/([^\/]+)\/([^\/]+)/;
const decode = () =>{
    if(imeSme==="" || imeJed===""){
    const match = location.pathname.match(regex);
    if (match) {      
        const decodedSmestajIme = decodeURIComponent(match[1]);
        const decodedImeJedinice = decodeURIComponent(match[2]);
         imeJed=decodedImeJedinice;
         imeSme=decodedSmestajIme;
    } }
}
    useEffect(() => {    
        decode();
        if(!get){
        getJedinicu();}
    },[]);

    async function getJedinicu() {
        try {
            get=true;
           console.log(imeSme,imeJed)
            const response = await fetch('http://localhost:3000/api/SmestajnaJedinicaRuta/' +imeSme +'/'+imeJed);
            if (response.ok) {
                const data = await response.json();
                setSmestajnaJedinica(data);
                setDvoriste(data.dvoriste ? "Da" : "Ne");
                setNazivSmestaja(data.naziv);
              //  dispatch({ type: 'GET_SMESTAJ', payload: data });
            } else {
                console.error('Greška pri dobijanju smestajne jedinice');
            }
        } catch (error) {
            console.error('Greška pri dobijanju smestajne jedinice:', error);
        }
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsEditing(false);
        if (isEditing) {
            if (!smestajnaJedinica.imeSmestaja ||
                !smestajnaJedinica.imeJedinice || 
                !smestajnaJedinica.brojSobe ||
                !smestajnaJedinica.brojKreveta        
            ) {
                setErrorMessage("Sva polja moraju biti popunjena");
            } else {

                try {
                    const response = await fetch('http://localhost:3000/api/SmestajnaJedinicaRuta/' + smestajnaJedinica.imeSmestaja + '/'+smestajnaJedinica.imeJedinice, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(smestajnaJedinica)
                    });
                    if (response.ok) {
                        navigate('/stanodavac/smestaj/'+smestajnaJedinica.imeSmestaja);
                        //mozda ovde neki dispatch
                    } else {
                        setErrorMessage("Greška pri ažuriranju smestaja");
                    }
                } catch (error) {
                    setErrorMessage("Greška pri ažuriranju smestaja: " + error.message);
                }
            }
        } else {
            setIsEditing(true);
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

    return (
        <div>
            <div className="dodavanje-smestaja">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Naziv smeštajne jedinice:</label>
                        <input
                            type="text"
                            disabled//={!isEditing}
                            value={smestajnaJedinica.imeJedinice}
                            onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, imeJedinice: e.target.value }))}
                            onFocus={clearErrorMessage}
                        />
                    </div>
                    <div className="form-group">
                        <label>Broj sobe:</label>
                        <input
                            type="text"
                            disabled={!isEditing}
                            value={smestajnaJedinica.brojSobe}
                            onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, brojSobe: e.target.value }))}
                            onFocus={clearErrorMessage}
                        />
                    </div>
                    <div className="form-group">
                        <label>Broj kreveta:</label>
                        <input
                            type="text"
                            disabled={!isEditing}
                            value={smestajnaJedinica.brojKreveta}
                            onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, brojKreveta: e.target.value }))}
                            onFocus={clearErrorMessage}
                            onKeyPress={(e) => {
                                const charCode = e.charCode;
                                if (charCode < 48 || charCode > 57) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>                
                    <div className="form-group">
                        <label>Kuhinja:</label>
                        <select
                            value={smestajnaJedinica.kuhinja ? "Da":"Ne"}
                            onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, kuhinja: e.target.value === "Da" }))}
                            onFocus={clearErrorMessage}
                            disabled={!isEditing}
                        >
                            <option value="Da">Da</option>
                            <option value="Ne">Ne</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Wifi:</label>
                        <select
                            value={smestajnaJedinica.wifi ? "Da":"Ne"}
                            onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, wifi: e.target.value === "Da" }))}
                            onFocus={clearErrorMessage}
                            disabled={!isEditing}
                        >
                            <option value="Da">Da</option>
                            <option value="Ne">Ne</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Televizor:</label>
                        <select
                            value={smestajnaJedinica.tv ? "Da":"Ne"}
                            onChange={(e) =>  setSmestajnaJedinica(prev => ({ ...prev, tv: e.target.value === "Da" }))}
                            onFocus={clearErrorMessage}
                            disabled={!isEditing}
                        >
                            <option value="Da">Da</option>
                            <option value="Ne">Ne</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Terasa:</label>
                        <select
                            value={smestajnaJedinica.terasa ? "Da":"Ne"}
                            onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, terasa: e.target.value === "Da" }))}
                            onFocus={clearErrorMessage}
                            disabled={!isEditing}
                        >
                            <option value="Da">Da</option>
                            <option value="Ne">Ne</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Cena:</label>
                        <input
                            type="text"
                            disabled={!isEditing}
                            value={smestajnaJedinica.cena}
                            onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, cena: e.target.value }))}
                            onFocus={clearErrorMessage}
                            onKeyPress={(e) => {
                                const charCode = e.charCode;
                                if (charCode < 48 || charCode > 57) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>   
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </form>
                <div className="images">
                    <h3>Slike apartmana</h3>
                    <input
                        type="file"
                        disabled={!isEditing}
                        id="file"
                        multiple
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <button type="button" onClick={() => document.getElementById('file').click()}>
                        Dodaj slike
                    </button>
                    {selectedImages.length > 0 && (
                        <div className="image-carousel" style={{ position: 'relative', marginTop: '10px' }}>
                            <button onClick={prevImage} className="carousel-button left">&#9664;</button>
                            <div className="image-container">
                                <img
                                    src={selectedImages[currentImageIndex]}
                                    alt={`Selected ${currentImageIndex}`}
                                    style={{ width: '600px', height: '400px', objectFit: 'cover' }}
                                />
                            </div>
                            <button onClick={nextImage} className="carousel-button right">&#9654;</button>
                            <button
                                onClick={() => removeImage(currentImageIndex)}
                                className="remove-button"
                            >
                                <MdCancel size={24} color="red" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div>
            {isEditing ? (
                <button className="generic-button" onClick={handleSubmit}>Sačuvaj</button>
            ) : (
                <button className="generic-button" onClick={handleEditClick}>Uredi</button>
            )}
            </div>
        </div>
    );
}

export default PrikazivanjeSmestaja;





