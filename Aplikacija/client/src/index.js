import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {GostContextProvider} from './kontekst/GostContext';
import { AuthContextProvider } from './kontekst/AuthContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
    <GostContextProvider>
      <App />
    </GostContextProvider> 
    </AuthContextProvider>
  </React.StrictMode>
)
