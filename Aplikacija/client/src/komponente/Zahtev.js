import React from 'react';

const Zahtev = ({ imeGosta, prezimeGosta, nazivSmestaja, nazivSmestajneJedinice, datumOd, datumDo, handleOdobri, handleOdbij, status, mejlStanodavca }) => {
  return (
    <div className="zahtev">
      <div className="podaci">
        
        <div><strong> Ime: </strong> {imeGosta}</div>
        <div><strong> Prezime:</strong> {prezimeGosta}</div>
        <div><strong> Naziv Smeštaja: </strong> {nazivSmestaja}</div>
        <div><strong> Naziv Smeštajne Jedinice: </strong> {nazivSmestajneJedinice}</div>
        <div><strong> Datum Od: </strong> {new Date(datumOd).toLocaleDateString()}</div>
        <div><strong> Datum Do: </strong> {new Date(datumDo).toLocaleDateString()}</div>
        <div><strong> Status:</strong> {status}</div>

      </div>
      {handleOdobri && handleOdbij && ( // Dodajemo ovaj uslovni operator koji proverava da li su propovi handleOdobri i handleOdbij definisani
        <div className="akcije">
          <button className="odobri" onClick={handleOdobri}>Odobri</button>
          <button className="odbij" onClick={handleOdbij}>Odbij</button>
        </div>
      )}
    </div>
  );
};

export default Zahtev;
