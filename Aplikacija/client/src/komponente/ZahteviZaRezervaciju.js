
import React, { useState, useEffect } from 'react';
import Zahtev from './Zahtev';
import { useAuthContext } from '../hooks/useAuthContext';

const ZahteviZaRezervaciju = () => {
  const [zahtevi, setZahtevi] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchZahtevi = async () => {
      try {
        if (user && user.stanodavacProfile) {
          const response = await fetch('/api/ZahtevRuta/stanodavac/zahtevi', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mejl: user.stanodavacProfile.mejl, status:"Na čekanju"})
          });

          if (response.ok) {
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

  const handleOdobri = async (zahtev) => {

    try {
      const response = await fetch('/api/ZahtevRuta/azuriraj-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id:zahtev._id, status:"Odobren"})
      });

      if (response.ok) {
          ukloniZahtev(zahtev._id)
      }
      else{
        console.error('Greška prilikom odobravanja zahteva');
      }

      const responseSmestaj = await fetch('/api/SmestajRuta/detalji/'+zahtev.nazivSmestaja)

      if(responseSmestaj.ok)
      {
      const smestajData = await responseSmestaj.json()
        
      const responseVaucer = await fetch('/api/VaucerRuta/create-vaucer',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ime:zahtev.imeGosta,
          prezime:zahtev.prezimeGosta,
          jmbg:zahtev.jmbg,
          nazivSmestaja: zahtev.nazivSmestaja,
          nazivSmestajneJedinice: zahtev.nazivSmestajneJedinice,
          mesto:smestajData.naseljeIme,
          ulica:smestajData.ulica,
          datumOd: zahtev.datumOd,
          datumDo: zahtev.datumDo,
          stanodavacMejl: zahtev.stanodavacMejl
        })
      });
    }

    }
    catch (error) {
      console.error('Greška prilikom odobravanja zahteva:', error);
    }
  };

  const ukloniZahtev = (idZahteva) => {
    const noviZahtevi = zahtevi.filter(zahtev => zahtev.id !== idZahteva);
    setZahtevi(noviZahtevi);
  };
  
  const handleOdbij = async (id) => {
 
    try {
     
      await fetch(`/api/ZahtevRuta/zahtevi/${id}`, {
        method: 'DELETE'
      });
      setZahtevi(prevZahtevi => prevZahtevi.filter(zahtev => zahtev._id !== id));
    } catch (error) {
      console.error('Greška prilikom brisanja zahteva:', error);
    }
  };

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
            mejlStanodavca={zahtev.stanodavacMejl}
            handleOdobri={() => handleOdobri(zahtev)}
            handleOdbij={() => handleOdbij(zahtev._id)}
          />
        ))
      ) : (
        <div>Nema dostupnih zahteva</div>
      )}
    </div>
  );
};

export default ZahteviZaRezervaciju;
