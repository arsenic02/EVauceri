import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useAuthContext } from '../hooks/useAuthContext';

const MenuStanodavac = () => {
  const [smestajiDropdownVisible, setSmestajiDropdownVisible] = useState(false);
  const [evidencijaDropdownVisible, setEvidencijaDropdownVisible] = useState(false);
  const { smestaji, dispatch } = useAuthContext();

  useEffect(() => {
    async function fetchSmestaji() {
      try {
        const userDataString = localStorage.getItem('user'); 
        const userData = JSON.parse(userDataString); 
        const mejl = userData.mejl;

        //Vraca sve smestaje za jednog stanodavca
        const response = await fetch('/api/SmestajRuta/'+mejl);
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'SET_SMESTAJI', payload: data });
        } else {
          console.error('Greška pri dobijanju smestaja');
        }
      } catch (error) {
        console.error('Greška pri dobijanju smestaja:', error);
      }
    }

    fetchSmestaji();
  }, [dispatch]);

  return (
    <nav className="menu">
      <ul>
        <li
          className="dropdown"
          onMouseEnter={() => setSmestajiDropdownVisible(true)}
          onMouseLeave={() => setSmestajiDropdownVisible(false)}
        >
          <Link to="/stanodavac/smestaj" className="dropdown-title">
            Smestaji▼
          </Link>
          {smestajiDropdownVisible && (   
            <ul className="dropdown-menu">
            {smestaji.map((smestaj) => (
              <li key={smestaj.naziv}>
                <Link to={`/stanodavac/smestaj/${smestaj.naziv}`}>{smestaj.naziv}</Link>
              </li>
            ))}
            <li>
              <Link to="/stanodavac/smestaj/dodaj">Dodaj nov smestaj</Link>
            </li>
          </ul>
          )}
        </li>
        <li>
          <Link to="/stanodavac/kalendar">Kalendar</Link>
        </li>
        <li
          className="dropdown"
          onMouseEnter={() => setEvidencijaDropdownVisible(true)}
          onMouseLeave={() => setEvidencijaDropdownVisible(false)}
        >
          <Link to="/stanodavac/evidencija" className="dropdown-title">
            Evidencija▼
          </Link>
          {evidencijaDropdownVisible && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/stanodavac/evidentirajgosta">Evidentiraj novog gosta</Link>
              </li>
              <li>
                <Link to="/stanodavac/evidencija">Prikaz evidencije</Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/stanodavac/zahtevi">Zahtevi za rezervaciju</Link>
        </li>
        <li>
          <Link to="/stanodavac/profil">Profil</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MenuStanodavac;

