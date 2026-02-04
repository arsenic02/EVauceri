//rezervacije za gosta
//treba da se uredi, ovo je kod iz ZAhteviZaRezervaciju.js
//  ---->

import React, { useState, useEffect } from 'react';
import Zahtev from './Zahtev';
import { useAuthContext } from '../hooks/useAuthContext';

const RezervacijeGosta = () => {
  const [zahtevi, setZahtevi] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
  
    //treba metoda koja ce po gostu da pribavlja zahteve
    const fetchZahtevi = async () => {
      try {
        console.log(user)
        if (user && user.guestProfile) {
        
          const response = await fetch('/api/ZahtevRuta/gost/zahtevi', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ jmbg: user.guestProfile.jmbg, status:"Na čekanju"})
          });

          if (response.ok) {
            console.log(response)
            const data = await response.json();
            setZahtevi(data);
          } else {
            console.error('Greška pri dobijanju zahteva');
          }
        }
      } catch (error) {
        console.error('Greška prilikom dobijanja zahteva:', error);
      }
    };

    if (user) {
      fetchZahtevi();
    }
  }, [user]);


  if (!user) {
    return <div>Učitavanje podataka o korisniku...</div>;
  }

  return (
    <div>
      {zahtevi.length > 0 ? (
        zahtevi.map((zahtev) => (
          <Zahtev
            key={zahtev._id}
            imeGosta={zahtev.imeGosta}
            prezimeGosta={zahtev.prezimeGosta}
            nazivSmestaja={zahtev.nazivSmestaja}
            nazivSmestajneJedinice={zahtev.nazivSmestajneJedinice}
            datumOd={zahtev.datumOd}
            datumDo={zahtev.datumDo}
            status={zahtev.status}
          />
        ))
      ) : (
        <div>Nema dostupnih zahteva</div>
      )}
    </div>
  );
};

export default RezervacijeGosta;




