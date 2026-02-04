// src/komponente/Menu.js
import React from 'react';
import { Link } from 'react-router-dom';
const Menu = () => {
  return (
      <nav className="menu">
        <ul>
          <li>
            <Link to="/gost/pretraga">Pretraga</Link>
          </li>
          <li>
            <Link to="/gost/vauceri">Vauceri</Link>
          </li>
          <li>
            <Link to="/gost/rezervacije">Rezervacije</Link>
          </li>
          <li>
            <Link to="/gost/profil">Profil</Link>
          </li>
        </ul>
      </nav>
  );
};

export default Menu;
