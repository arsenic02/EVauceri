// src/stranice/Gost.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Pretraga from '../komponente/Pretraga';
import Vauceri from '../komponente/Vauceri';
import Rezervacije from '../komponente/Rezervacije';
import Profil from '../komponente/Profil';
import Menu from '../komponente/MenuGost';
import GostPregled from './GostPregledSmestaja'
import RezervisiGost from '../komponente/RezervisiGost';
import Cards from '../komponente/GostPrikazivanjeSmestajneJedinice';
import Vaucer from '../komponente/Vauceri';
import Placanje from '../komponente/Placanje';
import PrikazVaucera from '../komponente/PrikazVaucera';
//import './Gost.css'; // You can style the Gost page as needed

const Gost = () => {
  return (
    <div className="gost">
      <Menu />
      <div className="content">
        <Routes>
          <Route path="/pretraga" element={<Pretraga />} />
          <Route path="/vauceri" element={<PrikazVaucera />} />
          <Route path="/rezervacije" element={<Rezervacije />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/pretraga/:naziv" element={<GostPregled/>}/>
          {/* <Route path="/pretraga/:naziv/rezervisi" element={<RezervisiGost/>} /> */}
          <Route path="/pretraga/:naziv/:nazivSmestajneJedinice/rezervisi" element={<RezervisiGost />} />
          <Route path="/pretraga/:naziv/:nazivSmestajneJedinice/rezervisi/vaucer" element={<Vaucer />} />
          <Route path="/pretraga/:naziv/:nazivSmestajneJedinice/rezervisi/placanje" element={<Placanje />} />
        </Routes>
      </div>
      
      {/* <div>
        Dobrodošli na stranicu gost. Ovde imate razne mogucnosti.
      </div> */}
    
    </div>
  );
};

export default Gost;

/*
import {useEffect} from 'react'
//Komponente
import GostProfil from '../komponente/GostProfil'
import WorkoutForm from '../komponente/ProbaForma'
import { useGostContext } from '../hooks/useGostContext'
import Navbar from '../komponente/StickeyNavbar';
import { Link, Routes, Route } from 'react-router-dom';

<Navbar>
  <Link to="/pretraga">Pretraga</Link>
  <Link to="/vauceri">Vauceri</Link>
  <Link to="/rezervacije">Rezervacije</Link>
  <Link to="/profil">Profil</Link>
</Navbar>

const Gost = () => {  
    const {gosts, dispatch}  = useGostContext()

    //Koristi se samo jednom, kada se pokrene Home, zato se stavlja [] na kraju
    useEffect(()=>{
    const fetchTemp = async () =>{
        const response = await fetch('/api/GostRuta')//samo tokom produkcije koda, na kraju orra da se obeybedi da sve putanje ukazuju na korektan endpoint.
        const json = await response.json()

        if(response.ok)
        {
            dispatch({type: 'SET_GOST', payload: json})
        }
    }

    fetchTemp()
    }, [dispatch]) 

    return (

        <div className="home">
           
          <div >
            {gosts && gosts.map((proba)=>(
               // <GostProfil key={proba._id} proba={proba}></GostProfil>

                <GostProfil proba={proba} key={proba._id} />
            ))}

          </div>
          <h1>Dobrodošli na stranicu gosta</h1>
      <Link to="/gost/vauceri">Vauceri</Link>
      <Link to="/gost/rezervacije">Rezervacije</Link>
      <Link to="/gost/profil">Profil</Link>
      <GostProfil />
        </div>
    )
}

export default Gost */