import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './stranice/Home';
import Navbar from './komponente/StickeyNavbar';
import Help from './stranice/Help';
import Register from './stranice/Register';
import Login from './stranice/Login';
import Footer from './komponente/Footer';
import Gost from './stranice/Gost';
import Stanodavac from './stranice/Stanodavac';
import { GostContextProvider } from './kontekst/GostContext';
import { StanodavacContextProvider } from './kontekst/StanodavacContext';
import { InspektorContextProvider } from './kontekst/InspektorContext';
import { AuthContextProvider } from './kontekst/AuthContext';
import Profil from './komponente/Profil';
import Vauceri from './komponente/Vauceri';
import Rezervacije from './komponente/Rezervacije';
import Pretraga from './komponente/Pretraga';
import DodavanjeSmestajneJedinice from './komponente/DodavanjeSmestajneJedinice';
import SmestajnaJedinicaEdit from './komponente/SmestajnaJedinicaEdit'
import RezervisiGost from './komponente/RezervisiGost';
import Inspektor from './stranice/Inspektor';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <AuthContextProvider>
        <GostContextProvider>
          <StanodavacContextProvider>
            <InspektorContextProvider>
              <Navbar />
              <div>
                <Routes>
                <Route path="/pretraga" element={<Pretraga />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/gost/*" element={<Gost />} />
                  <Route path="/stanodavac/*" element={<Stanodavac />} /> 
                  <Route path="/inspektor/*" element={<Inspektor />} />  
                </Routes>
              </div>
              <Footer />
            </InspektorContextProvider>
          </StanodavacContextProvider>
        </GostContextProvider>
      </AuthContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
