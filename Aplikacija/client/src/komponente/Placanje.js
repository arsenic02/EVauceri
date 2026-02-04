import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import { useAuthContext } from '../hooks/useAuthContext';

const Placanje = () => {

  const [showStatus, setShowStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reservationDisabled, setReservationDisabled] = useState(false);
  const location = useLocation();
  const { startDate, endDate } = location.state || {};
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      console.log(user); 

      if (!user.guestProfile) {
        setReservationDisabled(true);
        setShowStatus(true);
      }
    }
  }, [user]);

  const handleSendRequest = async () => {
    if (reservationDisabled) return;
    setShowStatus(true);
    setShowModal(true);
    setReservationDisabled(true);
   
      const stanodavacMejl = await fetchStanodavacInfo(location.pathname.split('/')[3]);  //Vraca mejl stanodavca
      const smestaj = decodeURIComponent(location.pathname.split('/')[3]);
      const smestajResponse = await fetch('/api/SmestajRuta/detalji/' + smestaj);
      let smestajData = '';
      //Kreira zahtev
      try {
        if (smestajResponse.ok) {
          smestajData = await smestajResponse.json();
        }
        const response = await fetch(' http://localhost:3000/api/ZahtevRuta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imeGosta: user.guestProfile.ime,
            prezimeGosta: user.guestProfile.prezime,
            jmbg: user.guestProfile.jmbg,
            nazivSmestaja: decodeURIComponent(location.pathname.split('/')[3]),
            nazivSmestajneJedinice: decodeURIComponent(location.pathname.split('/')[4]),
            datumOd: startDate,
            datumDo: endDate,
            stanodavacMejl: stanodavacMejl,
            vaucer: false,
            mesto: smestajData.naseljeIme,
            ulica: smestajData.ulica
          }),
        });

        if (!response.ok) {
          throw new Error('Greska prilikom slanja zahteva');
        }

        const result = await response.json();
        console.log('Zahtev uspesno poslat:', result);
      } catch (error) {
        console.error('Greska:', error);
      }
    
    setTimeout(() => {
      setShowModal(false);
    }, 3000);
  };

  if (!user) {
    return <div>Učitavanje podataka o korisniku...</div>;
  }

  //Vraca mejl stanodavca koji drzi dati smestaj i smestajnu jedinicu
  const fetchStanodavacInfo = async (smestajNaziv) => {
    try {
      const response = await fetch(`/api/SmestajRuta/detalji/${smestajNaziv}`);//Smestaj umesto SmestajRuta
      console.log("Smestaj je"+response)
      if (!response.ok) {
        throw new Error('Greška pri dobijanju informacija o stanodavcu');
      }
      const data = await response.json();
      return data.vlasnik;
    } catch (error) {
      console.error('Greška pri dobijanju informacija o stanodavcu:', error);
      return null;
    }
  };
  
  return (
    <div className="form-container">
      <h2>Rezervacija plaćanjem</h2>
      {startDate && endDate && (
        <p>Period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</p>
      )}

      <button onClick={handleSendRequest} disabled={reservationDisabled} className="button">Pošalji zahtev</button>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="custom-modal"
        contentLabel="Provera Modal"
      >
        <div>
          <div className="status-bar">
            <div className="status-bar-inner load"></div>
          </div>
          <p>Provera kreditne kartice...</p>
        </div>
      </Modal>

      {showStatus && (
        <div className="status-message" style={{ color: 'green' }}>
          <p>Rezervacija uspesno izvrsena!</p>
        </div>
      )}
    </div>
  );
};

export default Placanje;
