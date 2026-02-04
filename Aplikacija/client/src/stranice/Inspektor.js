import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InspektorSmestaji from "../komponente/InspektorSmestaji";
import InspektorStanodavci from "../komponente/InspektorStanodavci";
import Kazne from "../komponente/Kazne";
import MenuInspektor from "../komponente/MenuInspektor";
import InspektorProfil from '../komponente/InspektorProfil';

const Inspektor = () => {
    return (
      <div className="gost">
        <MenuInspektor />
        <div className="content">
          <Routes>
            <Route path="/stanodavci" element={<InspektorStanodavci />} />
            <Route path="/smestaji" element={<InspektorSmestaji />} />
            <Route path="/kazne" element={<Kazne />} />
            <Route path="/profil" element={<InspektorProfil />} />

            
          </Routes>
        </div>
        
        {/* <div>
          Dobrodošli na stranicu inspektora. Ovde imate razne mogucnosti.
        </div> */}
      
      </div>
    );
  };
  
  export default Inspektor;