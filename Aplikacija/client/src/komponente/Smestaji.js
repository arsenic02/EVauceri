import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdCancel, MdPlace } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext";
import Select from 'react-select';

const PrikazivanjeSmestaja = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [Dvoriste, setDvoriste] = useState("Da");
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();
    const [selectedNaselje, setSelectedNaselje] = useState('');
    const [selectedUlica, setSelectedUlica] = useState('');
    const [naselja, setNaselja] = useState([]);
    const [smestaj, setSmestaj] = useState({
        naziv: "",
        udaljenostOdCentra: "",
        brojSoba: "",
        naseljeIme: "",
        ulica: "",
        dvoriste: "",
        brojParkingMesta: ""
    });

    const location = useLocation();
    const segment = location.pathname.split('/').pop();
    const lastSegment = decodeURIComponent(segment);

    useEffect(() => {
        getSmestaj();
        fetchNaselja();
    }, [location]);

    async function getSmestaj() {
        try {
            const response = await fetch('/api/SmestajRuta/detalji/' + lastSegment);
            if (response.ok) {
                const data = await response.json();
                setSmestaj(data);
                setDvoriste(data.dvoriste ? "Da" : "Ne");
                setSelectedNaselje(data.naseljeIme);
                setSelectedUlica(data.ulica);
                dispatch({ type: 'GET_SMESTAJ', payload: data });
            } else {
                console.error('Greška pri dobijanju smestaja');
            }
        } catch (error) {
            console.error('Greška pri dobijanju smestaja:', error);
        }
    }

    const fetchNaselja = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/NaseljeRuta');
            if (response.ok) {
                const data = await response.json();
                setNaselja(data);
            } else {
                console.error("Failed to fetch naselja");
            }
        } catch (error) {
            console.error("Error fetching naselja:", error);
        }
    };

    const naseljeOptions = naselja.map(naselje => ({
        value: naselje.ime,
        label: naselje.ime
    }));

    const ulicaOptions = selectedNaselje
        ? (naselja.find(naselje => naselje.ime === selectedNaselje)?.ulice || []).map(ulica => ({
            value: ulica,
            label: ulica
        }))
        : [];

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsEditing(false);
        let daLi = Dvoriste === "Da";
        if (isEditing) {
            if (!smestaj.naziv || !smestaj.udaljenostOdCentra || !smestaj.brojSoba || !smestaj.brojParkingMesta) {
                setErrorMessage("Sva polja moraju biti popunjena");
            } else {
                const userDataString = localStorage.getItem('user');
                const userData = JSON.parse(userDataString);
                const userEmail = userData.mejl;

                const updatedSmestaj = {
                    ...smestaj,
                    vlasnik: userEmail,
                    dvoriste: daLi,
                    slike: []
                };

                try {
                    const response = await fetch('/api/SmestajRuta/' + smestaj.naziv, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedSmestaj)
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setSmestaj(data);
                        setSelectedNaselje(data.naseljeIme);
                        setSelectedUlica(data.ulica);
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

    const handleAddUnitClick = () => {
        navigate('/stanodavac/smestaj/' + lastSegment + '/dodajSmestajnuJedinicu');
    };

    const handleBrisanjeSmestaja = async () =>{
        //smestaj
        try{
        const responseSJ = await fetch('/api/SmestajnaJedinicaRuta/delete-sj-smestaja/'+smestaj.naziv,{
            method: 'DELETE'
        });
        }
        catch(errot)
        {

        }
        const responseSM = await fetch('/api/SmestajRuta/brisi/' + smestaj._id, {
            method: 'DELETE'
        });
        
        if(responseSM.ok)
        {
            navigate('/stanodavac');
        }
    } 

    return (
        <div>
            <div className="dodavanje-smestaja">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Naziv smestaja:</label>
                        <input
                            type="text"
                            disabled //={!isEditing} mora da bude disableovano da bi se pretrazilo u bazi na osnovu imena
                            value={smestaj.naziv}
                            onChange={(e) => setSmestaj(prev => ({ ...prev, naziv: e.target.value }))}
                            onFocus={clearErrorMessage}
                        />
                    </div>

                    <div className="form-group">
                        <p>Mesto</p>
                        
                        <Select
                            value={naseljeOptions.find(option => option.value === selectedNaselje)}
                            onChange={(selectedOption) => {
                                const naseljeIme = selectedOption ? selectedOption.value : '';
                                setSelectedNaselje(naseljeIme);
                                setSelectedUlica(''); // Resetovanje ulice kada se promeni naselje
                                setSmestaj(prev => ({ ...prev, naseljeIme })); // Update smestaj object
                            }}
                            options={naseljeOptions}
                            placeholder="Turistička destinacija"
                            isDisabled={!isEditing}
                            isClearable
                        />
                    </div>
                    <div className="form-group">
                        <p>Ulica</p>
                        
                        <Select
                            value={ulicaOptions.find(option => option.value === selectedUlica)}
                            onChange={(selectedOption) => {
                                const ulica = selectedOption ? selectedOption.value : '';
                                setSelectedUlica(ulica);
                                setSmestaj(prev => ({ ...prev, ulica })); // Update smestaj object
                            }}
                            options={ulicaOptions}
                            placeholder="Izaberite ulicu"
                            isDisabled={!selectedNaselje || !isEditing}
                            isClearable
                        />
                    </div>

                    <div className="form-group">
                        <label>Udaljenost od centra:</label>
                        <input
                            type="text"
                            disabled={!isEditing}
                            value={smestaj.udaljenostOdCentra}
                            onChange={(e) => setSmestaj(prev => ({ ...prev, udaljenostOdCentra: e.target.value }))}
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
                        <label>Broj soba:</label>
                        <input
                            type="text"
                            disabled={!isEditing}
                            value={smestaj.brojSoba}
                            onChange={(e) => setSmestaj(prev => ({ ...prev, brojSoba: e.target.value }))}
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
                        <label>Dvoriste:</label>
                        <select
                            value={Dvoriste}
                            onChange={(e) => setDvoriste(e.target.value)}
                            onFocus={clearErrorMessage}
                            disabled={!isEditing}
                        >
                            <option value="Da">Da</option>
                            <option value="Ne">Ne</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Broj parking mesta:</label>
                        <input
                            type="text"
                            disabled={!isEditing}
                            value={smestaj.brojParkingMesta}
                            onChange={(e) => setSmestaj(prev => ({ ...prev, brojParkingMesta: e.target.value }))}
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
                        <label>Ocena:</label>
                        <input
                            type="text"
                            disabled={true}
                            value={smestaj.prosecnaOcena}                       
                            onFocus={clearErrorMessage}                          
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
                 <button className="cancel-button" onClick={handleBrisanjeSmestaja}>Obriši smeštaj</button>
                <button className="generic-button" onClick={handleAddUnitClick}>Dodaj smeštajnu jedinicu</button>
            </div>
        </div>
    );
}

export default PrikazivanjeSmestaja;

