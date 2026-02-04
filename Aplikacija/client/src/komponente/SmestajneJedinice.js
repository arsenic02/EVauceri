//ja nzm stvarno zasto se nadovezuju ove gluposti
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
const Cards = ({imeSmestaja}) => {
  const { dispatch } = useAuthContext();
  const navigate =useNavigate()
  const [sj,setSmestajnaJedinica] = useState({
    imeSmestaja: "",
    imeJedinice: "",
    brojSobe: 0,
    klima: "",
    brojKreveta: 0,
    kuhinja: "",
    wifi: "",
    tv: "",
    terasa: "",
    ocene: [] ,// Početno stanje, pretpostavljamo da su ocene prazan niz
    prosecnaOcena: 0,
    cena:0
    });
  const [smestajneJedinice, setSmestajneJedinice] = useState([]);
  async function pronadjiSmestajneJedinice(imeSmestaja) {
    
    try {
      if(imeSmestaja!=null){
          const response = await fetch('/api/SmestajnaJedinicaRuta/smestaj/smestajne-jedinice/'+imeSmestaja);
          if (response.ok) {
            const data = await response.json();
            dispatch({ type: 'GET_SMESTAJNA_JEDINICA', payload: data });
            setSmestajneJedinice(data);
          }
          else{
            console.error('Greška pri dobijanju smestajne jedinice');
          }
      }
    } 
    catch (error) {
        console.error("Greška prilikom pronalaženja smeštajnih jedinica:", error);
        throw error;
    }
  }

  useEffect(() => {
    pronadjiSmestajneJedinice(imeSmestaja)
}, [imeSmestaja]);

//Mora da ima parametar koji mu kazuje koja jedinica se azurira
const handleEdit = (smestajnaJedinica) =>{
navigate('/stanodavac/'+imeSmestaja +'/'+smestajnaJedinica.imeJedinice);
}
const handleDelete = async (smestajnaJedinica) => {
  try {
    if (imeSmestaja != null) {
      const response = await fetch('/api/SmestajnaJedinicaRuta/delete/' + smestajnaJedinica.imeJedinice, {
        method: 'DELETE', // Postavljamo HTTP metod na DELETE kako bismo izbrisali smještajnu jedinicu
      });

      if (response.ok) {
        pronadjiSmestajneJedinice(imeSmestaja);//dodato
        // Dodajte ovde bilo koju dodatnu logiku koju želite da izvršite nakon brisanja
      } else {
        console.error('Greška pri brisanju smeštajne jedinice:', response.statusText);
      }
    } else {
      console.error('Greška pri dobijanju smeštajne jedinice');
    }
  } catch (error) {
    console.error('Greška prilikom pronalaženja smeštajnih jedinica:', error);
    throw error;
  }
};

  return (
    <div className="cardsWrapper">
      <div className="cards">
        {smestajneJedinice.length === 0 && <p>Nema pronadjenih smeštajnih jedinica</p>}
        {smestajneJedinice.map((smestajnaJedinica) => {
          return (
            <div key={smestajnaJedinica._id} className="card">
              <h3>{smestajnaJedinica.imeJedinice}</h3>
              <div className="text">
                <p>
                  <span className="label">Broj sobe:</span>
                </p>
                <p>
                  <span className="info">{smestajnaJedinica.brojSobe}</span>
                </p>
                <p>
                  <span className="label">Broj kreveta:</span>
                </p>
                <p>
                  <span className="info">{smestajnaJedinica.brojKreveta}</span>
                </p>
                <p>
                  <span className="label">Kuhinja:</span>
                </p>
                <p>
                  <span className="info">{smestajnaJedinica.kuhinja ? "Da" : "Ne"}</span>
                </p>
                <p>
                  <span className="label">Wifi:</span>
                </p>
                <p>
                  <span className="info">{smestajnaJedinica.wifi ? "Da" : "Ne"}</span>
                </p>
                <p>
                  <span className="label">Televizor:</span>
                </p>
                <p>
                  <span className="info">{smestajnaJedinica.tv ? "Da" : "Ne"}</span>
                </p>
                <p>
                  <span className="label">Terasa:</span>
                </p>
                <p>
                  <span className="info">{smestajnaJedinica.terasa ?  "Da" : "Ne"}</span>
                </p>
                
                <p>
                  <span className="label">Ocena:</span>
                </p>
                <p>
                  <span className="info">{smestajnaJedinica.prosecnaOcena }</span>
                </p>
                <p>
                  <span className="label">Cena:</span>
                </p>
                <p>
                  <span className="info">{smestajnaJedinica.cena} RSD</span>
                </p>

              </div>
              <div className="btnContainer">    

              <button onClick={()=> handleEdit(smestajnaJedinica) } >Uredi</button>             
              <button onClick={() => handleDelete(smestajnaJedinica)}>Obrisi</button>
     

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Cards;
