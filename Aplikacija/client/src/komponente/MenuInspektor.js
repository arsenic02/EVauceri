// src/komponente/Menu.js
import React from 'react';
import { Link } from 'react-router-dom';
//import './index.css'; // You can style the menu as needed

const MenuInspektor = () => {
  return (
    <nav className="menu">
      <ul>
        <li>
          <Link to="/inspektor/stanodavci">Stanodavci</Link>
        </li>
        <li>
          <Link to="/inspektor/smestaji">Smestaji</Link>
        </li>
        <li>
          <Link to="/inspektor/kazne">Kazne</Link>
        </li>
        <li>
          <Link to="/inspektor/profil">Profil</Link>
        </li>
        
      </ul>
    </nav>
  );
};

export default MenuInspektor;