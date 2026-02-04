import React, { useContext } from 'react';
import Banner from '../komponente/Banner';
import Footer from '../komponente/Footer';
import CreateVoucher from '../komponente/PrikazVaucera';
import { useState, useEffect } from "react";
import Pretraga from '../komponente/Pretraga';
import { FaHotel, FaAddressCard, FaClipboardCheck } from 'react-icons/fa';
import { AuthContext } from '../kontekst/AuthContext';
import Menu from '../komponente/MenuGost';
import MenuInspektor from '../komponente/MenuInspektor';
import MenuStanodavac from '../komponente/MenuStanodavac';
import NajboljeOcenjeniSmestaji from '../komponente/NajboljeOcenjeniSmestaji'
const Home = () => {
  const { user } = useContext(AuthContext);

  let userMenu = null;
  if (user) {
    switch (user.role) {
      case 'gost':
        userMenu = <Menu />;
        break;
      case 'inspektor':
        userMenu = <MenuInspektor />;
        break;
      case 'stanodavac':
        userMenu = <MenuStanodavac />;
        break;
      default:
        userMenu = null;
    }
  }

  return (
    <div>
      <Banner />
      {userMenu && (
          <div className="user-menu">
            {userMenu}
          </div>
        )}
      <div className="pages">
        <div className="welcome-section">
          <h1 className="welcome-title">Dobrodošli na početnu stranicu!</h1>
          <p className="welcome-text">
            Dobrodošli na početnu stranicu portala E-vaučeri. Portal je namenjen gostima, stanodavcima, inspektorima.
            Ovde je moguće rezervisati smeštaj vaučerom. Ukoliko ste vaučer iskoristili, moguće je smeštaj
            rezervisati plaćanjem. Stanodavac može voditi evidenciju o rezervacijama, odobravati zahteve gostiju za rezervaciju.
            Inspektor može nadgledati aktivnosti stanodavaca.
          </p>
          <div className="features">
            <div className="feature">
              <FaHotel size={50} />
              <h2>Najbolji smeštaji</h2>
              <p>Pogledajte najbolje ocenjene smeštaje na našem portalu.</p>
            </div>
            <div className="feature">
              <FaAddressCard size={50} />
              <h2>Dobijanje vaučera</h2>
              <p>Od sada dobijanje vaučera brzo i lako</p>
            </div>
            <div className="feature">
              <FaClipboardCheck size={50} />
              <h2>Brze rezervacije</h2>
              <p>Rezervišite smeštaj brzo i lako putem našeg sistema.</p>
            </div>
          </div>
        </div>         
        <h1 style={{ textAlign: 'center'}}>Najbolje ocenjeni smeštaji!</h1> 
      </div>
    
    <NajboljeOcenjeniSmestaji/>
    </div>
  );
}

export default Home;

