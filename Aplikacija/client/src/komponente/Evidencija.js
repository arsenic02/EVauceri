import React, { useState, useEffect } from 'react';
import { FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { useAuthContext } from '../hooks/useAuthContext';

const Evidencija = () => {
  const { user } = useAuthContext();
  const [evidencije, setEvidencije] = useState([]);
  const [mejl, setMejl] = useState('');

  const handleOdjavi = async (jedinstveniBrojEvidencije) => {
    try {
      if (jedinstveniBrojEvidencije) {
        const response = await fetch('/api/EvidencijaRuta/update-evidencija', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: jedinstveniBrojEvidencije})//ovo id je nesrecno nazvano to je jbe
        });

        if (response.ok) {
          const data = await response.json();
          //naci evudenciju u evidencije [] koja ima isti jbe sa data, i onda taj element zameniti
          setEvidencije(prevEvidencije =>
            prevEvidencije.map(evidencija =>
              evidencija.jbe === data.jbe ? data : evidencija
            )
          );
        } else {
          console.error('Failed to fetch evidencije, response not ok:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Error fetching evidencije:', error);
    }

  }
  const getEvidencije = async () => {
    try {
      if (user?.stanodavacProfile?.mejl) {
        const response = await fetch('/api/EvidencijaRuta/get-stanodavac-evidencije', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ mejl: user.stanodavacProfile.mejl })
        });

        if (response.ok) {
          const data = await response.json();
          setEvidencije(Array.isArray(data) ? data : []); // Ensure data is an array
        } else {
          console.error('Failed to fetch evidencije, response not ok:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Error fetching evidencije:', error);
    }
  };

  useEffect(() => {
    if (user && user.stanodavacProfile && user.stanodavacProfile.mejl) {
      getEvidencije();
      setMejl(user.stanodavacProfile.mejl);
    }
  }, [user]);

  if (!user || !user.stanodavacProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Evidencija gostiju</h2>
      <table className="table-container">
        <thead>
          <tr>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Smeštaj</th>
            <th>Smeštajna jedinica</th>
            <th>Broj vaucera</th>
            <th>Status</th>
            <th>Datum dolaska</th>
            <th>Datum odlaska</th>
            <th className="actions-header"></th>
          </tr>
        </thead>
        <tbody>
          {evidencije.length > 0 ? (
            evidencije.map((ev, index) => (
              
              <tr key={index}>
                <td>{ev.ime}</td>
                <td>{ev.prezime}</td>
                <td>{ev.nazivSmestaja}</td>
                <td>{ev.nazivSmestajneJedinice}</td>
                <td>{ev.brojVaucera}</td>
                <td>{ev.status}</td>
                <td>{ev.datumDolaska}</td>
                <td>{ev.datumOdlaska}</td>
                <td className="actions">
                  <button className="icon-button logout-button" title="Odjavi gosta" onClick={() => handleOdjavi(ev.jbe)}>
                    <FaSignOutAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Nema dostupnih evidencija</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Evidencija;
