import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DodavanjeSmestajneJedinice = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const lastSegment = decodeURIComponent(location.pathname.split('/').slice(-2, -1)[0]);
    let imeJed = ""
    const [smestajnaJedinica, setSmestajnaJedinica] = useState({
        imeSmestaja: lastSegment,
        imeJedinice: "",
        brojSobe: 0,
        klima: false,
        brojKreveta: 0,
        kuhinja: false,
        wifi: false,
        tv: false,
        terasa: false,
        ocene:[],
        prosecnaOcena:0,
        cena:0
    });

    useEffect(() => {
    }, [lastSegment]);

    const handleUnitFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/SmestajnaJedinicaRuta/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(smestajnaJedinica)
            });
            if (response.ok) {
                navigate(`/stanodavac/smestaj/${lastSegment}`);
            } else {
                console.error('Greška pri dodavanju smeštajne jedinice:', response.statusText);
            }
        } catch (error) {
            console.error('Greška prilikom dodavanja smeštajne jedinice:', error);
        }
    };

    return (
        <div>
            <h2>Dodavanje Smeštajne Jedinice</h2>
            <form onSubmit={handleUnitFormSubmit}>
                <div className="form-group">
                    <label>Ime jedinice:</label>
                    <input
                        type="text"
                        value={smestajnaJedinica.imeJedinice}
                         min="0"
                        onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, imeJedinice: e.target.value }))}
                    />
                </div>
                <div className="form-group">
                    <label>Broj sobe:</label>
                    <input
                        type="number"
                        value={smestajnaJedinica.brojSobe}
                         min="0"
                        onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, brojSobe: parseInt(e.target.value) }))}
                    />
                </div>
                <div className="form-group">
                    <label>Broj kreveta:</label>
                    <input
                        type="number"
                        value={smestajnaJedinica.brojKreveta}
                         min="0"
                        onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, brojKreveta: parseInt(e.target.value) }))}
                    />
                </div>
                <div className="form-group">
                    <label>Klima:</label>
                    <select
                        value={smestajnaJedinica.klima ? "Da" : "Ne"}
                        onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, klima: e.target.value === "Da" }))}
                    >
                        
                        <option value="Da">Da</option>
                        <option value="Ne">Ne</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Kuhinja:</label>
                    <select
                        value={smestajnaJedinica.kuhinja ? "Da" : "Ne"}
                        onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, kuhinja: e.target.value === "Da" }))}
                    >
                        
                        <option value="Da">Da</option>
                        <option value="Ne">Ne</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Wifi:</label>
                    <select
                        value={smestajnaJedinica.wifi ? "Da" : "Ne"}
                        onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, wifi: e.target.value === "Da" }))}
                    >
                        
                        <option value="Da">Da</option>
                        <option value="Ne">Ne</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Televizor:</label>
                    <select
                        value={smestajnaJedinica.tv ? "Da" : "Ne"}
                        onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, tv: e.target.value === "Da" }))}
                    >
                        
                        <option value="Da">Da</option>
                        <option value="Ne">Ne</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Terasa:</label>
                    <select
                        value={smestajnaJedinica.terasa ? "Da" : "Ne"}
                        onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, terasa: e.target.value === "Da" }))}
                    >
                        
                        <option value="Da">Da</option>
                        <option value="Ne">Ne</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Cena:</label>
                    <input
                        type="number"
                        value={smestajnaJedinica.cena}
                        min="0"
                        onChange={(e) => setSmestajnaJedinica(prev => ({ ...prev, cena: parseInt(e.target.value) }))}
                    />
                </div>
                <button type="submit">Dodaj</button>
            </form>
        </div>
    );
};

export default DodavanjeSmestajneJedinice;
