//  RegistrationPage.js

//KOD GDE SE PORUKA UKLANJA PRILIKOM KLIKA NA INPUT POLJE
import { FaYoutube, FaPhone, FaRegCreditCard, FaEye, FaEyeSlash, FaBarcode  } from "react-icons/fa";
import React, { useState } from "react";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoHome, IoCalendarNumberSharp } from "react-icons/io5";
//import { IoCalendarNumberSharp } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineConfirmationNumber } from "react-icons/md";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { IoMdWarning } from "react-icons/io";
import { useRegister } from "../hooks/useRegister";
import {BrowserRouter, Routes, Route,Link, useNavigate} from 'react-router-dom'
import { useHistory } from 'react-router-dom';

function RegistrationPage() {
  const [selectedType, setSelectedType] = useState("gost");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // Stanje za praćenje grešaka
  const [errorMessageGost, setErrorMessageGost] = useState("");
  const [errorMessageMejl, setErrorMessageMejl] = useState("");
  const [errorMessageVaziDo, setErrorMessagevaziDo] = useState("");//poruka za vazi do
  const {registerGost,registerStanodavac,registerInspektor, error, isLoading} = useRegister()

  //gost
  const [Ime, setIme] = useState("");
  const [Prezime, setPrezime] = useState("");
  const [JMBG, setJMBG] = useState("");
  const [Mesto, setMesto] = useState("");
  const [Tel, setTel] = useState("");
  const [Mejl, setMejl] = useState("");
  const [brojKartice,setBrojKartice] = useState("");
  const [vaziDo, setVaziDo] = useState("");
  const [CVC, setCVC] = useState("");

  
  const [IDStanodavac, setIDStanodavca] = useState("");//stanodavac
  const[IDInspektor, setIDInspektora] = useState("");//inspektor


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  //const history = useHistory();
  const navigate = useNavigate();

  const handleRegistration = async () => {
    const newErrors = {}; // Resetujemo greške prilikom svakog submita
    let redirectTo = "";
  
    // Provera za svaki tip naloga
    if (selectedType === "gost") {
      if (!password) {
        newErrors.password = "Unesite šifru";
      }
  
      if (!Ime || !Prezime || !JMBG || !password || !Mesto || !Tel || !Mejl || !brojKartice || !vaziDo || !CVC){
        setErrorMessageGost("Sva polja moraju biti uneta");
      } else {
        await registerGost(Ime,Prezime,JMBG,Mesto,Tel,Mejl,password,brojKartice,vaziDo,CVC);
        redirectTo = "/gost/pretraga"; ///gost, probao sam i sa gost/pretraga i sa pretraga, ali fora ovde dodaje link
      }
    } else if (selectedType === "stanodavac") {
      if(!Ime || !Prezime || !JMBG || !password || !IDStanodavac || !Tel || !Mejl || !brojKartice || !vaziDo || !CVC)
        setErrorMessageGost("Sva polja moraju biti uneta");
      else {
        await registerStanodavac(Ime,Prezime,JMBG,IDStanodavac,Tel,Mejl,password,brojKartice,vaziDo,CVC);
        // Možete postaviti gde želite da preusmerite korisnika nakon registracije stanodavca
        redirectTo = "/stanodavac/kalendar";
      }
    } else if (selectedType === "inspektor") {
      if(!Ime || !Prezime || !JMBG || !password || !IDInspektor || !Tel || !Mejl )
        setErrorMessageGost("Sva polja moraju biti uneta");
      else {
        await registerInspektor(Ime,Prezime,JMBG,IDInspektor,Tel,Mejl,password);
        // Postavite redirekciju za inspektora
        redirectTo = "/inspektor/stanodavci";
      }
    }
  
  
    if (redirectTo) {
   
     navigate(redirectTo);
    }
    setErrors(newErrors);
  };
  const clearErrorMessageGost = () => {
    setErrorMessageGost('');
  };

  return (
    <div>
      {
     
      <select className="select-box" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
      <option value="gost">Gost</option>
      <option value="stanodavac">Stanodavac</option>
      <option value="inspektor">Inspektor</option>
    </select> 

      }
      

      {selectedType === "gost" && (
        <div>
          <div className="input-with-icon">
            <MdDriveFileRenameOutline  className="input-icon" />
         <input 
  type="text" 
  placeholder="Ime" 
  onFocus={clearErrorMessageGost} 
  onKeyPress={(e) => {
    const charCode = e.charCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      e.preventDefault();
    }
  }}
  onChange={(e) => setIme(e.target.value)}
/>
 </div>
<div className="input-with-icon">
            <MdDriveFileRenameOutline  className="input-icon" />
  <input 
  type="text" 
  placeholder="Prezime" 
  onFocus={clearErrorMessageGost} 
  onKeyPress={(e) => {
    const charCode = e.charCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      e.preventDefault();
    }
  }}
  onChange={(e) => setPrezime(e.target.value)}
/> </div>
{/* <input type="text" placeholder="JMBG" onChange={(e) => setJMBG(e.target.value)} onFocus={clearErrorMessage} /><br /> */}
<div className="input-with-icon">
            <MdOutlineConfirmationNumber  className="input-icon" />
<input 
  type="text" 
  placeholder="JMBG" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    let jmbg = e.target.value;
    // Zamjena svega osim brojeva sa praznim stringom
    jmbg = jmbg.replace(/\D/g, ''); 
    // Ako je unesen više od 13 cifara, zadržavamo samo prvih 13
    if (jmbg.length > 13) {
      jmbg = jmbg.slice(0, 13);
    }
    e.target.value = jmbg;
    setJMBG(jmbg)
  }}
/> </div>
          <div className="input-with-icon">
            <IoHome className="input-icon" />
          {/*<input type="text" placeholder="Mesto prebivalista" onFocus={clearErrorMessageGost} /> */} 
          <input 
  type="text" 
  placeholder="Mesto prebivalista" 
  onFocus={clearErrorMessageGost} 
  onKeyPress={(e) => {
    const charCode = e.charCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      e.preventDefault();
    }
  }}
  onChange={(e) => setMesto(e.target.value)}
/> 
          </div>
          <div className="input-with-icon">
            <FaPhone className="input-icon" />
            {/*<input type="text" placeholder="Broj telefona" onFocus={clearErrorMessage} /> */}
            <input 
  type="text" 
  placeholder="Broj telefona" 
  onFocus={clearErrorMessageGost} 
  onKeyPress={(e) => {
    const charCode = e.charCode;

    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  }}
  onChange={(e) => setTel(e.target.value)}
/>

          </div>
          <div className="input-with-icon">
            <CiMail className="input-icon" />
            {/* <input type="text" placeholder="vasmejl@gmail.com" onFocus={clearErrorMessage} />*/}
            <input 
  type="text" 
  placeholder="Email" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    const email = e.target.value;
   
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      
      setErrorMessageMejl("Unesite validnu email adresu");
    } else {
      setErrorMessageMejl("");
    }
    setMejl(e.target.value)
  }}

/>

          </div>
          {errorMessageMejl && <p style={{ color: "red", marginTop: "5px" }}>{errorMessageMejl}</p>}
          <div className="input-with-icon">
            <FaRegCreditCard className="input-icon" />
            {/* <input type="text" placeholder="Broj kartice" onFocus={clearErrorMessage} />*/}
            <input 
  type="text" 
  placeholder="Broj kartice" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    let brojKartice = e.target.value;
    // Zamjena svega osim brojeva sa praznim stringom
    brojKartice = brojKartice.replace(/\D/g, ''); 
    // Ako je unesen više od 16 cifara, zadržavamo samo prvih 13
    if (brojKartice.length > 16) {
      brojKartice = brojKartice.slice(0, 16);
    }
    e.target.value = brojKartice;
    setBrojKartice(e.target.value)
  }}
/>
          </div>
          {/* <input type="text" placeholder="Važi do" onFocus={clearErrorMessage} /><br /> */}
          <div className="input-with-icon">
          <IoCalendarNumberSharp className="input-icon" />
          <input 
        type="text" 
        placeholder="Važi do (MM/YY)" 
        onFocus={clearErrorMessageGost} 
        pattern="(0[1-9]|1[0-2])\/(19|20)\d{2}" 
        title="Unesite datum u formatu MM/YY (npr. 01/24)" 
        maxLength="5"
        onKeyPress={(e) => {
          const charCode = e.charCode;
          if (e.target.value.length >= 5 || (charCode !== 47 && (charCode < 48 || charCode > 57))) {
            e.preventDefault();
            setErrorMessagevaziDo("Unesite datum u formatu MM/YY (npr. 01/24)");
          }
        }}

        onChange={(e) => {
          const vazi = e.target.value;
         
          const vaziPattern = /\d{2}\/\d{2}/;
          /* /^[^\s@]+@[^\s@]+\.[^\s@]+$/; */
          if (!vaziPattern.test(vazi)) {
            
            setErrorMessagevaziDo("Unesite datum u formatu MM/YY (npr. 01/24)");
          } else {
            setErrorMessagevaziDo("");
          }
          setVaziDo(e.target.value)
        }}
      /> </div>
      {errorMessageVaziDo && <p style={{ color: "red" }}>{errorMessageVaziDo}</p>}
          {/* <input type="text" placeholder="CVC kod" onFocus={clearErrorMessage} /><br />*/}
          <div className="input-with-icon">
          <FaBarcode  className="input-icon" />
          <input 
  type="text" 
  placeholder="CVC kod" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    let number = e.target.value;
    
    const numberPattern = /^\d{0,3}$/;
    if (!numberPattern.test(number)) {
 
      number = number.slice(0, 3).replace(/\D/g, ''); 
      e.target.value = number;
    }
    setCVC(e.target.value)
  }}
/> </div>

          <div className="input-with-icon">
            <RiLockPasswordFill className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Šifra"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={clearErrorMessageGost}
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      )}

{/* ----------------------------------------STANODAVAC-----------------------------------------------------------*/}
{/* ----------------------------------------STANODAVAC-----------------------------------------------------------*/}
{/* ----------------------------------------STANODAVAC-----------------------------------------------------------*/}
{/* ----------------------------------------STANODAVAC-----------------------------------------------------------*/}
{/* ----------------------------------------STANODAVAC-----------------------------------------------------------*/}
      {selectedType === "stanodavac" && (
        <div>
          {/*
        <input type="text" placeholder="Ime" onFocus={clearErrorMessage} /><br />
          <input type="text" placeholder="Prezime" onFocus={clearErrorMessage} /><br />
        */  
        }
        <div className="input-with-icon">
            <MdDriveFileRenameOutline  className="input-icon" />
           <input 
  type="text" 
  placeholder="Ime" 
  onFocus={clearErrorMessageGost} 
  onKeyPress={(e) => {
    const charCode = e.charCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      e.preventDefault();
    }
  }}
  onChange={(e) => setIme(e.target.value)}
/> </div>
  
  <div className="input-with-icon">
            <MdDriveFileRenameOutline  className="input-icon" />
  <input 
  type="text" 
  placeholder="Prezime" 
  onFocus={clearErrorMessageGost} 
  onKeyPress={(e) => {
    const charCode = e.charCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      e.preventDefault();
    }
  }}
  onChange={(e) => setPrezime(e.target.value)}
/> </div> 
{/*<input type="text" placeholder="JMBG" onFocus={clearErrorMessageGost} /><br /> 
<input type="text" placeholder="ID" onFocus={clearErrorMessageGost} /><br />
<input type="text" placeholder="Broj telefona" onFocus={clearErrorMessageGost} /><br />
*/}
<div className="input-with-icon">
            <MdOutlineConfirmationNumber  className="input-icon" />
<input 
  type="text" 
  placeholder="JMBG" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    let jmbg = e.target.value;
    
    jmbg = jmbg.replace(/\D/g, ''); 
  
    if (jmbg.length > 13) {
      jmbg = jmbg.slice(0, 13);
    }
    e.target.value = jmbg;
    setJMBG(e.target.value)
  }}
/> </div>
<div className="input-with-icon">
            <AiOutlineFieldNumber   className="input-icon" />
<input 
  type="text" 
  placeholder="ID" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    let id = e.target.value;
    
    id = id.replace(/\D/g, ''); 
    
    e.target.value = id;
    setIDStanodavca(e.target.value)
  }}
/> </div>
<div className="input-with-icon">
            <FaPhone className="input-icon" />
<input 
  type="text" 
  placeholder="BrojTelefona" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    let id = e.target.value;
    id = id.replace(/\D/g, ''); 
    
    e.target.value = id;
    setTel(e.target.value)
  }}
/>   </div>
<div className="input-with-icon">
            <CiMail className="input-icon" />
<input 
  type="text" 
  placeholder="Email" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    const email = e.target.value;
   
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessageMejl("Unesite validnu email adresu");
    } else {
      setErrorMessageMejl("");
    }
    setMejl(e.target.value)
  }}
/> </div>

{errorMessageMejl && <p style={{ color: "red", marginTop: "5px" }}>{errorMessageMejl}</p>}
         
<div className="input-with-icon">
            <FaRegCreditCard className="input-icon" />
            {/* <input type="text" placeholder="Broj kartice" onFocus={clearErrorMessage} />*/}
            <input 
  type="text" 
  placeholder="Broj kartice" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    let brojKartice = e.target.value;
    // Zamjena svega osim brojeva sa praznim stringom
    brojKartice = brojKartice.replace(/\D/g, ''); 
    // Ako je unesen više od 16 cifara, zadržavamo samo prvih 13
    if (brojKartice.length > 16) {
      brojKartice = brojKartice.slice(0, 16);
    }
    e.target.value = brojKartice;
    setBrojKartice(e.target.value)
  }}
/>
          </div>
          {/* <input type="text" placeholder="Važi do" onFocus={clearErrorMessage} /><br /> */}
          <div className="input-with-icon">
          <IoCalendarNumberSharp className="input-icon" />
          <input 
        type="text" 
        placeholder="Važi do (MM/YY)" 
        onFocus={clearErrorMessageGost} 
        pattern="(0[1-9]|1[0-2])\/(19|20)\d{2}" 
        title="Unesite datum u formatu MM/YY (npr. 01/24)" 
        maxLength="5"
        onKeyPress={(e) => {
          const charCode = e.charCode;
          if (e.target.value.length >= 5 || (charCode !== 47 && (charCode < 48 || charCode > 57))) {
            e.preventDefault();
            setErrorMessagevaziDo("Unesite datum u formatu MM/YY (npr. 01/24)");
          }
        }}

        onChange={(e) => {
          const vazi = e.target.value;
         
          const vaziPattern = /\d{2}\/\d{2}/;
          /* /^[^\s@]+@[^\s@]+\.[^\s@]+$/; */
          if (!vaziPattern.test(vazi)) {
            
            setErrorMessagevaziDo("Unesite datum u formatu MM/YY (npr. 01/24)");
          } else {
            setErrorMessagevaziDo("");
            setVaziDo(e.target.value)
          }
        }}
      /> </div>
      {errorMessageVaziDo && <p style={{ color: "red" }}>{errorMessageVaziDo}</p>}
          {/* <input type="text" placeholder="CVC kod" onFocus={clearErrorMessage} /><br />*/}
          <div className="input-with-icon">
          <FaBarcode  className="input-icon" />
          <input 
  type="text" 
  placeholder="CVC kod" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    let number = e.target.value;
    const numberPattern = /^\d{0,3}$/;
    if (!numberPattern.test(number)) {
      number = number.slice(0, 3).replace(/\D/g, ''); 
      e.target.value = number;
    }
    setCVC(e.target.value);
  }}
/> </div>          
          <div className="input-with-icon">
            <RiLockPasswordFill className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Šifra"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={clearErrorMessageGost}
            />
            <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      )}
  
{/* ----------------------------------------INSPEKTOR-----------------------------------------------------------*/}
{/* ----------------------------------------INSPEKTOR-----------------------------------------------------------*/}
{/* ----------------------------------------INSPEKTOR-----------------------------------------------------------*/}
{/* ----------------------------------------INSPEKTOR-----------------------------------------------------------*/}
{/* ----------------------------------------INSPEKTOR-----------------------------------------------------------*/}

      {selectedType === "inspektor" && (
        <div>
          {/*<input type="text" placeholder="Ime" onFocus={clearErrorMessage} /><br />*/}
          <div className="input-with-icon">
            <MdDriveFileRenameOutline  className="input-icon" />
          <input 
  type="text" 
  placeholder="Ime" 
  onFocus={clearErrorMessageGost} 
  onKeyPress={(e) => {
    const charCode = e.charCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      e.preventDefault();
    }
  }}
  onChange={(e) => setIme(e.target.value)}
/> </div>
  
  <div className="input-with-icon">
            <MdDriveFileRenameOutline  className="input-icon" />
  <input 
  type="text" 
  placeholder="Prezime" 
  onFocus={clearErrorMessageGost} 
  onKeyPress={(e) => {
    const charCode = e.charCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      e.preventDefault();
    }
  }}
  onChange={(e) => setPrezime(e.target.value)}
/> </div> 
          {/*<input type="text" placeholder="Prezime" onFocus={clearErrorMessage} /><br /> */}
          <div className="input-with-icon">
            <MdOutlineConfirmationNumber  className="input-icon" />
          {/*<input type="text" placeholder="JMBG" onFocus={clearErrorMessageGost} /><br />*/}
          <input 
  type="text" 
  placeholder="JMBG" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    let jmbg = e.target.value;
    // Zamjena svega osim brojeva sa praznim stringom
    jmbg = jmbg.replace(/\D/g, ''); 
    // Ako je unesen više od 13 cifara, zadržavamo samo prvih 13
    if (jmbg.length > 13) {
      jmbg = jmbg.slice(0, 13);
    }
    e.target.value = jmbg;
    setJMBG(e.target.value);
  }}
/>
           </div>
           <div className="input-with-icon">
            <AiOutlineFieldNumber   className="input-icon" />
<input 
  type="text" 
  placeholder="ID" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    let id = e.target.value;
    
    id = id.replace(/\D/g, ''); 
    
    e.target.value = id;
    setIDInspektora(e.target.value)
  }}
/> </div>
          <div className="input-with-icon">
            <FaPhone className="input-icon" />
<input 
  type="text" 
  placeholder="BrojTelefona" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    let id = e.target.value;
    id = id.replace(/\D/g, ''); 
    
    e.target.value = id;
    setTel(e.target.value);
  }}
/>   </div>

<div className="input-with-icon">
            <CiMail className="input-icon" />
  <input 
  type="text" 
  placeholder="Email" 
  onFocus={clearErrorMessageGost} 
  onChange={(e) => {
    const email = e.target.value;
   
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessageMejl("Unesite validnu email adresu");
    } else {
      setErrorMessageMejl("");
    }
    setMejl(e.target.value)
  }}
/> </div>

{errorMessageMejl && <p style={{ color: "red", marginTop: "5px" }}>{errorMessageMejl}</p>}
          
          <div className="input-with-icon">
            <RiLockPasswordFill className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Šifra"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={clearErrorMessageGost}
            />
            <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      )}

      {/*errorMessageGost && <p>{errorMessageGost}</p>*/}
      {errorMessageGost && <p style={{ color: "red" }}>{errorMessageGost}</p>}
       {/*<button type="submit" onClick={{handleRegistration/*handleSubmit}}>Potvrdi</button> */}
       <button type="submit" onClick={handleRegistration}>Potvrdi</button>

    </div>
  );
}

export default RegistrationPage;