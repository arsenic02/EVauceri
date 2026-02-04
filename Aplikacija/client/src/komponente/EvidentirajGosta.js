import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const EvidentirajGosta = ({imeSmestaja}) => {

  
  const [formData, setFormData] = useState({
    Ime: '',
    Prezime: '',
    JMBG: '',
    brojVaucera: 'bez vaucera',
    smestaj: '',
    smestajnaJedinica: '',
    status: 'Prijavljen'
  });

  const { user,dispatch } = useAuthContext();
 const  [smestaji,setSmetaji]= useState([]);
 const  [smestajneJedinice,setSmestajneJedinice]= useState([]);
 const  [vauceri,setVauceri]= useState([]);
  const [selectedsmestaj, setSelectedsmestaj] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  
  const [selectedVaucer, setSelectedVaucer] = useState('bezVaucera');

  const fetchSmestaji = async () => {
    try {
      if (user && user.stanodavacProfile.mejl) {   
        const response = await fetch('/api/SmestajRuta/' + user.stanodavacProfile.mejl);
        if (response.ok) {
          const data = await response.json();
          setSmetaji(data);
          //dispatch({ type: 'SET_SMESTAJI', payload: data });

          if (!selectedsmestaj) {         
            //Ako nista nije selektovano, onda se stavlja defaul vrednost    
            const defaultSmestaj = data[0]?.naziv;
            setSelectedsmestaj(defaultSmestaj);
            setFormData(prevData => ({
              ...prevData,
              smestaj: defaultSmestaj,
            }));
            if(defaultSmestaj)
            fetchSmestajneJedinice(defaultSmestaj);
          }
          else{
            //ako jeste selektovan neki smestaj
            fetchSmestajneJedinice(selectedsmestaj);
          }

        } else {
          console.error('Greška pri dobijanju smestaja');
        }
      }
    } catch (error) {
      console.error('Greška prilikom dobijanja smestaja:', error);
    }
  };

  const fetchSmestajneJedinice = async (nazivSmestaja) => {
    try {
      if(nazivSmestaja){
          //Ako je nazivSmestaja validna vrednost, pribavi SJ    
          const response = await fetch('/api/SmestajnaJedinicaRuta/smestaj/smestajne-jedinice/' + nazivSmestaja);

          if (response.ok) {           
            const data = await response.json();
            setSmestajneJedinice(data);
          // dispatch({ type: 'SET_SMESTAJNE_JEDINICE', payload: data });
            if(!selectedUnit){
              const defaultUnit = data[0]?.imeJedinice;
              setSelectedUnit(defaultUnit);
              setFormData(prevData => ({
                ...prevData,
                smestajnaJedinica: defaultUnit,
              }));
            }        
          } 
          else {
            console.error('Greška pri dobijanju smestajnih jedinica');
          }
    }
    } catch (error) {
      console.error('Greška prilikom dobijanja smestajnih jedinica:', error);
    }
  };

  const fetchVauceri = async () => {
    try {
      if (user && user.stanodavacProfile.mejl) {
        const mejl = user.stanodavacProfile.mejl
        const response = await fetch(`/api/VaucerRuta/vauceri/`+ mejl);//loguje sadkdshfkjdfhsdjk@example.com
        //const response = await fetch(`/api/VaucerRuta/vauceri/${user.stanodavacProfile.mejl}`);loguje sadkdshfkjdfhsdjk@example.com
        //console.log(response)
        if (response.ok) {
         
          const data = await response.json();
          setVauceri(data);

          if (!selectedVaucer && data.length > 0) {
            const defaultVaucer = data[0].jbv;
            setSelectedVaucer(defaultVaucer);
            setFormData(prevData => ({
                ...prevData,
                brojVaucera: defaultVaucer,
            }));
        } else if (data.length === 0) {
            
            setSelectedVaucer('bez vaucera');
            setErrorMessage("")
        }
          /*
          if(!selectedVaucer){
            const defaultVaucer= data[0].jbv;
            setSelectedVaucer(defaultVaucer);
            setFormData(prevData => ({
              ...prevData,
              brojVaucera: defaultVaucer,
            }));*/
          }
         // dispatch({ type: 'SET_VAUCERI', payload: data });
        
        } 
      }
    catch (error) {
      console.error('Greška prilikom dobijanja vaucera:', error);
    }
  };
  
  useEffect(() => {
    if (user && user.stanodavacProfile.mejl) {
      fetchSmestaji();
    }
  }, [user]);

  useEffect(() => {
    if (selectedsmestaj) {
      fetchSmestajneJedinice(selectedsmestaj);
    }
  }, [selectedsmestaj]);

  useEffect(() => {
    if (user && user.stanodavacProfile.mejl){
      fetchVauceri()
    }
    
  }, [vauceri]);
 
  const handleSelectSmestaj = (smestaj) => {
    setSelectedsmestaj(smestaj);
    setFormData(prevData => ({
      ...prevData,
      smestaj: smestaj,
    }));
  };

  const handleSelectSmestajnaJedinica = (unit) => {
    setSelectedUnit(unit);
    setFormData(prevData => ({
      ...prevData,
      smestajnaJedinica: unit,
    }));
  };

  const handleSelectVaucer = (selectedVaucer) => {
    setSelectedVaucer(selectedVaucer);
    setFormData(prevData => ({
      ...prevData,
      brojVaucera: selectedVaucer,
    }));
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.Ime) newErrors.Ime = "Ime je obavezno";
    if (!formData.Prezime) newErrors.Prezime = "Prezime je obavezno";
    if (!formData.JMBG || formData.JMBG.length !== 13) newErrors.JMBG = "JMBG mora imati 13 cifara";
    if (!formData.brojVaucera) newErrors.brojVaucera = "Broj vaucera je obavezan";
    if (!formData.smestaj) newErrors.smestaj = "Smestaj je obavezan";
    if (!formData.smestajnaJedinica) newErrors.smestajnaJedinica = "Smestajna jedinica je obavezna";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessage("Sva polja moraju biti uneta");
      return;
    }

    setErrors({});
    setErrorMessage("");

    try { 
    //Kreira evidenciju
    const responseEvidencija = await fetch('/api/EvidencijaRuta/create-evidencija', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ime: formData.Ime,
        prezime: formData.Prezime,
        jmbg: formData.JMBG,
        jbv: formData.brojVaucera,
        nazivSmestaja: formData.smestaj,
        nazivSmestajneJedinice: formData.smestajnaJedinica,
        stanodavacMejl: user.stanodavacProfile.mejl,
        datumDolaska: new Date().toLocaleDateString('sr-RS'),
        status: "Prijavljen"
      })
    });
    console.log(responseEvidencija)
    if(responseEvidencija.ok)

      {}
      resetForm();
      //Logika za kreiranje u bazi
     
    } catch (error) {
      setErrorMessage("Došlo je do greške pri evidentiranju gosta");
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage('');
  };

  const resetForm = () => {
    setFormData({
      Ime: '',
      Prezime: '',
      JMBG: '',
      brojVaucera: '',
      smestaj: '',
      smestajnaJedinica: '',
    });
    setErrors({});
    setErrorMessage('');
  };

  const handleKeyPress = (e) => {
    const charCode = e.charCode;
    const char = String.fromCharCode(charCode);
    const regex = /^[a-zA-ZčČćĆžŽšŠđĐа-яА-ЯёЁєЄіїІЇ]*$/;
    if (!regex.test(char)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <h2>Ovde treba uneti podatke o gostu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Ime">Ime:</label>
          <input
            type="text"
            id="Ime"
            name="Ime"
            value={formData.Ime}
            onChange={handleChange}
            onFocus={clearErrorMessage}
            onKeyPress={handleKeyPress}
          />
          {errors.Ime && <p style={{ color: "red" }}>{errors.Ime}</p>}
        </div>
        <div>
          <label htmlFor="Prezime">Prezime:</label>
          <input
            type="text"
            id="Prezime"
            name="Prezime"
            value={formData.Prezime}
            onFocus={clearErrorMessage}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          {errors.Prezime && <p style={{ color: "red" }}>{errors.Prezime}</p>}
        </div>
        <div>
          <label htmlFor="JMBG">JMBG:</label>
          <input
            type="text"
            id="JMBG"
            name="JMBG"
            value={formData.JMBG}
            onFocus={clearErrorMessage}
            onChange={(e) => {
              let jmbg = e.target.value.replace(/\D/g, '');
              if (jmbg.length > 13) jmbg = jmbg.slice(0, 13);
              setFormData((prevData) => ({
                ...prevData,
                JMBG: jmbg,
              }));
            }}
          />
          {errors.JMBG && <p style={{ color: "red" }}>{errors.JMBG}</p>}
        </div>

        <div>
        <label htmlFor="Smestaj">Smestaj:</label>
        <select value={selectedsmestaj} onChange={e => handleSelectSmestaj(e.target.value)}>
        {smestaji.map((smestaj, index) => (
          <option key={index} value={smestaj.naziv}>{smestaj.naziv}</option>
        ))}
      </select>

      </div>
      <div>
      <label htmlFor="Smestajna jedinica">Smestajna jedinica:</label>
      <select value={selectedUnit} onChange={e => handleSelectSmestajnaJedinica(e.target.value)}>
        {smestajneJedinice.map((jedinica, index) => (
          <option key={index} value={jedinica.imeJedinice}>{jedinica.imeJedinice}</option>
        ))}
      </select>
        </div>

        <div>
       
          {errors.smestajnaJedinica && <p style={{ color: "red" }}>{errors.smestajnaJedinica}</p>}
        </div>

        <div>

  <label htmlFor="BrojVaucera">Broj vaucera:</label>
  <select value={selectedVaucer} onChange={e => handleSelectVaucer(e.target.value)} >
  <option value='bez vaucera' >Bez vaucera</option>
    {vauceri.map((vaucer) => (
      <option key={vaucer.jbv} value={vaucer.jbv}>{vaucer.jbv}</option>
      
    ))}
  </select>

  {errors.jbv && <p style={{ color: "red" }}>{errors.jbv}</p>}
</div>


        <button type="submit">
          Evidentiraj
        </button>
      </form>
      
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default EvidentirajGosta;
