
//kod sa proverom i broja slobodnih vaucera
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import { useAuthContext } from '../hooks/useAuthContext';

const Vaucer = () => {
  const [salary, setSalary] = useState('');
  const [selectedOccupation, setSelectedOccupation] = useState('');
  const [vaucerStatus, setVaucerStatus] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reservationDisabled, setReservationDisabled] = useState(false);
  const location = useLocation();
  const [mestoPrebivalistaError, setMestoPrebivalistaError] = useState(false);
  const { startDate, endDate } = location.state || {};
  const [imaVaucer, setImaVaucer] = useState(false);

  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      if (!user.guestProfile) {
        setReservationDisabled(true);
        setVaucerStatus('Korisnički podaci nisu dostupni.');
        setShowStatus(true);
      } else {
        checkGost();
      }
    }
  }, [user]);

  const handleSendRequest = async () => {
    if (reservationDisabled || imaVaucer) return;

    const response = await fetch('/api/BrojVauceraRuta/dekrementiraj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (!result.success) {
      setVaucerStatus('Nažalost, izdati su svi vaučeri.');
      setShowStatus(true);
      return;
    }

    let isVaucerApproved = false;

    if (['radno angazovana lica', 'civilni invalidi', 'ratni vojni invalidi'].includes(selectedOccupation)) {
      if (salary && salary <= 80000) {
        isVaucerApproved = true;
      }
    } else {
      isVaucerApproved = true;
    }

    setVaucerStatus(isVaucerApproved ? 'Ispunjavate uslove za vaucere. Poslat je zahtev stanodavcu. Ako stanodavac prihvati vas zahtev, dobicete vaucer' : 'Ne ispunjavate uslove za dobijanje vaucera.');
    setShowStatus(true);

    setShowModal(true);
    setReservationDisabled(true);

    if (isVaucerApproved) {
      const stanodavacMejl = await fetchStanodavacInfo(location.pathname.split('/')[3]);
      const smestaj = decodeURIComponent(location.pathname.split('/')[3]);
      const smestajResponse = await fetch('/api/SmestajRuta/detalji/' + smestaj);
      let smestajData = '';

      try {
        if (smestajResponse.ok) {
          smestajData = await smestajResponse.json();
          if (smestajData.naseljeIme === user.guestProfile.mestoPrebivalista) {
            setMestoPrebivalistaError(true);
            throw new Error('Gost ne moze da uzme vaucer za mesto koje mu je mesto prebivalista');
          } else {
            const response = await fetch('http://localhost:3000/api/ZahtevRuta', {
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
                vaucer: true,
                mesto: smestajData.naseljeIme,
                ulica: smestajData.ulica
              }),
            });

            if (!response.ok) {
              throw new Error('Greska prilikom slanja zahteva');
            }

            const result = await response.json();
          }
        }
      } catch (error) {
        console.error('Greska:', error);
      }
    }

    setTimeout(() => {
      setShowModal(false);
    }, 3000);
  };

  if (!user) {
    return <div>Učitavanje podataka o korisniku...</div>;
  }

  const checkGost = async () => {
    try {
      if(user.guestProfile.jmbg){
          const checkGostResponse = await fetch('/api/VaucerRuta/vaucer-gost', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ jmbg: user.guestProfile.jmbg }),
          })

          if (checkGostResponse.ok) {
              const data = await checkGostResponse.json();
              if(data){
                setImaVaucer(true);
                setVaucerStatus('Ne mozete rezervisati vaucerom, zato sto vec imate vaucer.');
                setShowStatus(true);
                setReservationDisabled(true);
              } else {
                setImaVaucer(false);
              }
          }
      }
    } catch (error) {
      console.error('Greška gost ima vaucer:', error);
    }
  }

  const fetchStanodavacInfo = async (smestajNaziv) => {
    try {
      const response = await fetch(`/api/SmestajRuta/detalji/${smestajNaziv}`);
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
      <h2>Rezervacija putem vaučera</h2>
      {startDate && endDate && !mestoPrebivalistaError && !imaVaucer && (
        <p>Period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</p>
      )}
      {mestoPrebivalistaError && (<p>Ne mozete izabrati smestaj iz istog mesta gde vam je mesto prebivalista</p>)}

      <div>
        <label className="label">Unesite svoju platu:</label>
        <input type="number" value={salary} min="0" step="1000" onChange={(e) => setSalary(e.target.value)} className="input" disabled={!['radno angazovana lica', 'civilni invalidi', 'ratni vojni invalidi'].includes(selectedOccupation)} />
      </div>

      <div>
        <label className="label">Odaberite zanimanje:</label>
        <select onChange={(e) => setSelectedOccupation(e.target.value)} className="select">
          <option value="penzioneri">Penzioneri</option>
          <option value="nezaposleno lice">Nezaposleno lice</option>
          <option value="studenti">Studenti</option>
          <option value="radno angazovana lica">Radno angažovana lica</option>
          <option value="poljoprivrednici">Poljoprivrednici</option>
          <option value="civilni invalidi">Civilni invalidi</option>
          <option value="ratni vojni invalidi">Ratni vojni invalidi</option>
        </select>
      </div>

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
          <p>Provera uslova za dobijanje vaucera...</p>
        </div>
      </Modal>

      {showStatus && (
        <div className="status-message" style={{ color: vaucerStatus === 'Vaucer je dobijen.' ? 'green' : 'red' }}>
          <p>{vaucerStatus}</p>
        </div>
      )}
    </div>
  );
};

export default Vaucer;
