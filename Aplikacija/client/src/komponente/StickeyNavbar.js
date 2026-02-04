import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
//import "../index.css";
import { ImExit } from 'react-icons/im';
import { useNavigate } from "react-router-dom";
//import {useLogin} from "../hooks/useAuthContext"

const StickyNavbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate('/home');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [user]);

  //console.log('Logged in user:', user);

  return (
    <header className={isSticky ? "sticky" : ""}>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/home">
              <h1>E-vaučeri</h1>
            </Link>
          </li>
        </ul>
        {user ? (
          <div>
            <ul className="right">
              {/* <li>
                <Link to={`/${user.role}`}>
                  <h1>{user.role}</h1>
                </Link>
              </li> */}
              <li>
                <Link to="/help">
                  <h1>Pomoć</h1>
                </Link>
              </li>
              <li>
                <ImExit className="exit-icon" onClick={handleClick} style={{ cursor: 'pointer' }} title="Odjavi se" />
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <ul className="right">
              <li>
                <Link to="/register">
                  <h1>Registruj se</h1>
                </Link>
              </li>
              <li>
                <Link to="/login">
                  <h1>Prijavi se</h1>
                </Link>
              </li>
              <li>
                <Link to="/help">
                  <h1>Pomoć</h1>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default StickyNavbar;

/*import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'
import "../index.css"
import { ImExit } from 'react-icons/im';
import { useNavigate } from "react-router-dom";

const StickyNavbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const {user} = useAuthContext()
  const { logout } = useLogout()
  const navigate = useNavigate();

  const handleClick = () => {
        logout();
        navigate('/home');
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [user]);

  return (
    <header className={isSticky ? "sticky" : ""}>
            <nav className="nav">
                <ul>
                      <li>
                        <Link to="/pocetna"> 
                          <h1>Početna</h1>
                        </Link>  
                      </li>  
                      <li>
                        <Link to="/home"> 
                          <h1>Home</h1>
                        </Link>  
                      </li>     
                </ul>
                {user && (
                    <div>
                        <ul className="right">
                          <li>
                            <Link to="/help">
                              <h1>Pomoć</h1>
                            </Link>
                          </li>
                          <li>
                          <ImExit className="exit-icon" onClick={handleClick} style={{ cursor: 'pointer' }} title="Odjavi se"/>

                          </li>
                        </ul>
                    </div>
              )}
                {!user && (
                  <div>
                      <ul className="right">
                        <li>
                          <Link to="/register">
                            <h1>Registruj se</h1>
                          </Link>
                        </li>
                        <li>
                          <Link to="/login">
                            <h1>Prijavi se</h1>
                          </Link>
                        </li>
                        <li>
                          <Link to="/help">
                            <h1>Pomoć</h1>
                          </Link>
                        </li>
                      </ul>
                  </div>
              )}
            </nav>
    </header>
  );
};

export default StickyNavbar; */
/*Ovde se kao ruta navodi ista ruta za datu stranicu, kao što je to putanja navedena u App.js fajlu za datu rutu */
/*Ovde se kao ruta navodi ista ruta za datu stranicu, kao što je to putanja navedena u App.js fajlu za datu rutu */