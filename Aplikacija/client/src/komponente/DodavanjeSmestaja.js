import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { useAuthContext } from "../hooks/useAuthContext";
import Select from 'react-select';
import { MdPlace } from "react-icons/md";

function DodavanjeSmestaja() {
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [NazivSmestaja, setNazivSmestaja] = useState("");
    const [Udaljenost, setUdaljenost] = useState("");
    const [BrojSoba, setBrojSoba] = useState("");
    const [Vlasnik, setVlasnik] = useState("");
    const [Dvoriste, setDvoriste] = useState("Da");
    const [BrojParkinga, setBrojParkinga] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [selectedNaselje, setSelectedNaselje] = useState('');
    const [selectedUlica, setSelectedUlica] = useState('');
    const [naselja, setNaselja] = useState([]);

    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetchNaselja();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if ( !NazivSmestaja || !Udaljenost || !BrojSoba || !Dvoriste || !BrojParkinga || !selectedNaselje || !selectedUlica) {
            setErrorMessage("Sva polja moraju biti popunjena");
            console.log("aaaa")
        } else {
            let dv = false
            if(Dvoriste==="Da"){           
                dv=true; 
            }
            const userDataString = localStorage.getItem('user'); // Dobijamo JSON string iz lokalnog skladišta
            const userData = JSON.parse(userDataString); // Parsiramo JSON string u JavaScript objekat
            const userEmail = userData.mejl;

            setErrorMessage("Svaka cast");
            const response = await fetch('/api/SmestajRuta/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    naziv: NazivSmestaja,
                    udaljenostOdCentra: Udaljenost,
                    brojSoba: BrojSoba,
                    naseljeIme: selectedNaselje, // Dodato polje za unos naselja
                    ulica: selectedUlica, // Dodato polje za unos ulice
                    vlasnik: userEmail,
                    dvoriste: dv,
                    brojParkingMesta: BrojParkinga,
                    slike: []  // Pretpostavimo da trenutno nemate slike, pa šaljemo prazan niz
                })
            })  

           // navigate("/stanodavac");
           if (response.ok) {
            const newSmestaj = await response.json();
            dispatch({ type: 'ADD_SMESTAJ', payload: newSmestaj });
            navigate("/stanodavac");
        } else {
            setErrorMessage('Greška pri dodavanju smeštaja');
        }
        }
        setErrors(newErrors);
    };

    const clearErrorMessage = () => {
        setErrorMessage('');
    };


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
        ? naselja.find(naselje => naselje.ime === selectedNaselje).ulice.map(ulica => ({
            value: ulica,
            label: ulica
        }))
        : [];


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
        
        <div className="dodavanje-smestaja">
            <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
                    <label>Naziv smestaja:</label>
                    <input
                        type="text"
                        value={NazivSmestaja}
                        onChange={(e) => setNazivSmestaja(e.target.value)}
                        onFocus={clearErrorMessage}
                    />
                </div>
                <div className="form-group">
                    <label>Udaljenost od centra:</label>
                    <input
                        type="text"
                        value={Udaljenost}
                        onChange={(e) => setUdaljenost(e.target.value)}
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
                        value={BrojSoba}
                        onChange={(e) => setBrojSoba(e.target.value)}
                        onFocus={clearErrorMessage}
                        onKeyPress={(e) => {
                            const charCode = e.charCode;
                            if (charCode < 48 || charCode > 57) {
                                e.preventDefault();
                            }
                        }}
                    />
                </div>
                
                <div className="input-with-icon-combobox">
                        <p>Mesto</p>
                        <MdPlace className="input-icon" />
                        <Select
                            value={naseljeOptions.find(option => option.value === selectedNaselje)}
                            onChange={(selectedOption) => {
                                const naseljeIme = selectedOption ? selectedOption.value : '';
                                setSelectedNaselje(naseljeIme);
                                setSelectedUlica(''); // Resetovanje ulice kada se promeni naselje
                                
                            }}
                            options={naseljeOptions}
                            placeholder="Mesto"
                            // isDisabled={!isEditing}
                            isClearable
                        />
                    </div>

                    <div className="input-with-icon-combobox">
                        <p>Ulica</p>
                        <MdPlace className="input-icon" />
                        <Select
                            value={ulicaOptions.find(option => option.value === selectedUlica)}
                            onChange={(selectedOption) => {
                                const ulica = selectedOption ? selectedOption.value : '';
                                setSelectedUlica(ulica);
                                // setSmestaj(prev => ({ ...prev, ulica })); // Update smestaj object
                            }}
                            options={ulicaOptions}
                            placeholder="Izaberite ulicu"
                            isDisabled={!selectedNaselje }
                            isClearable
                        />
                    </div>

                <div className="form-group">
                    <label>Dvoriste:</label>
                    <select
                        value={Dvoriste}
                        onChange={(e) => setDvoriste(e.target.value)}
                        onFocus={clearErrorMessage}
                    >
                        <option value="da">Da</option>
                        <option value="ne">Ne</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Broj parking mesta:</label>
                    <input
                        type="text"
                        value={BrojParkinga}
                        onChange={(e) => setBrojParkinga(e.target.value)}
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
                <button type="submit">Dodaj smestaj</button>
            </form>
            <div className="images">
                <h3>Slike apartmana</h3>
                <input
                    type="file"
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
    );
}

export default DodavanjeSmestaja;

