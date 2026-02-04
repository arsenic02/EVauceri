import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from 'react-router-dom'; 
import Cards from "../komponente/SmestajneJedinice"
const NajboljeOcenjeniSmestaji = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const [smestaji, setSmestaji] = useState([]);
  
    const getTopSmestajs = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/SmestajRuta/najbolji', {method: 'GET'});
            if (response.ok) {
            const data = await response.json();
            setSmestaji(data);
            }
        } catch (error) {
            console.error("Greska prilikom pribavljanja najbolje ocenjenih smestaja: " + error);
        }
    }
  
    useEffect(() => {
      getTopSmestajs();
    }, []);

    return (
        <div> 
            <div className="smestaji-list">      
                {smestaji.length > 0 ? (
                    smestaji.map(smestaj => (
                    <div key={smestaj._id} className="card">  
                            <Link to={`/gost/pretraga/${smestaj.naziv}`}>
                            <h3>{smestaj.naziv}</h3>  
                            </Link>                             
                            <div> 
                                <p><strong>Mesto:</strong> {smestaj.naseljeIme+', '+smestaj.ulica }</p>
                                <p><strong>Broj smestajnih jedinica:</strong> {smestaj.brojSoba}</p>
                                <p><strong>Udaljenost od centra:</strong> {smestaj.udaljenostOdCentra}</p>
                                <p><strong>Dvoriste:</strong> {smestaj.dvoriste ? "Da":"Ne"}</p>
                                <p><strong>Broj Parking mesta:</strong> {smestaj.brojParkingMesta}</p>  
                                <p><strong>Ocena:</strong> {smestaj.prosecnaOcena}</p>
                                    
                            </div>
                    </div>
                    ))
                ) : (
                    <p>Nema dostupnih smeštaja.</p>
                )}
 
            </div>
      </div>)

}
export default NajboljeOcenjeniSmestaji;
