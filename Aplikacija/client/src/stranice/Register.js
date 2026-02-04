//import React from 'react';
import React from "react";
import RegistrationPage from "../komponente/RegistrationPage";
import Footer from '../komponente/Footer';
const Register = () => {
    return (
        <div className="form-container">
            <div><h1>Dobrodošli na stranicu za Registraciju!</h1>
            <p>Izaberite tip naloga koji ćete napraviti. </p></div>
            <RegistrationPage />
        </div>
    );
}





export default Register;

