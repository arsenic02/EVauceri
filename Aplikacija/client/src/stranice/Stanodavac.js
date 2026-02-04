import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Smestaji from '../komponente/Smestaji';
//import Kalendar from '../komponente/Kalendar';
import Kalendar from '../komponente/KalendarRezervacija'
import Evidencija from '../komponente/Evidencija';
import ZahteviZaRezervaciju from '../komponente/ZahteviZaRezervaciju';
import Profil from '../komponente/Profil';
import MenuStanodavac from '../komponente/MenuStanodavac';
import DodavanjeSmestaja from '../komponente/DodavanjeSmestaja';
import EvidentirajGosta from '../komponente/EvidentirajGosta';
import StanodavacSmestaji from './StanodavacSmestaji'
import DodavanjeSmestajneJedinice from '../komponente/DodavanjeSmestajneJedinice';
import AzuriranjeSmestajneJedinice from '../komponente/SmestajnaJedinicaEdit';
const Stanodavac = () => {
  return (
    <div className="gost">
      <MenuStanodavac />
      <div className="content">
        <Routes>
          <Route path="/kalendar" element={<Kalendar />} />
          <Route path="/evidencija" element={<Evidencija />} /> 
          <Route path="/evidentirajgosta" element={<EvidentirajGosta />} />
          <Route path="/zahtevi" element={<ZahteviZaRezervaciju />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/smestaj" element={<DodavanjeSmestaja />} />
          <Route path="/smestaj/dodaj" element={<DodavanjeSmestaja />} />
          <Route path="/smestaj/:naziv" element={<StanodavacSmestaji/>} />
          <Route path="/smestaj/:naziv/dodajSmestajnuJedinicu" element={<DodavanjeSmestajneJedinice/>} />
          <Route path="/:smestaj/:jedinica" element={<AzuriranjeSmestajneJedinice/>}/>
        </Routes>
      </div>
      
      {/* <div>
        Dobrodošli na stranicu stanodavac. Ovde imate razne mogucnosti.
      </div> */}
    
    </div>
  );
};

export default Stanodavac;
