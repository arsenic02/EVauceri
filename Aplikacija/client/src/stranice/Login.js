import React from 'react';
import LoginForm from '../komponente/LoginForma';
import '../index.css';

const Login = () => {
    return (
        <div className="form-container"> 
            <div>
                <h1>Dobrodošli na stranicu za Login!</h1>
              
                <LoginForm />
            </div>
        </div>
    );
}

export default Login;
