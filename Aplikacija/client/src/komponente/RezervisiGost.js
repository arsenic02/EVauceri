import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router-dom';


const RezervisiGost = () => {
  const { naziv, nazivSmestajneJedinice } = useParams();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservedDates, setReservedDates] = useState([]);
  const [stanodavacMejl, setStanodavacMejl] = useState('');
  const navigate = useNavigate();
  const [warning, setWarning] = useState('');

  // Funkcija za smanjenje datuma za jedan dan
  const adjustDateByOneDay = (date) => {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() - 1);
    return adjustedDate;
  };

  //Pribavlja mejl stanodavca ciji se smestaj rezervise
  const fetchStanodavacMejl = async () => {
    try {
      const response = await fetch('/api/SmestajRuta/detalji/'+naziv)
      if (response.ok) {
        const data = await response.json();
        setStanodavacMejl(data.vlasnik);
      } else {
        console.error('Greška pri dobijanju mejla stanodavca');
      }
    } catch (error) {
      console.error('Greška prilikom dobijanja mejla stanodavca:', error);
    }
  };

  // Pribavlja zahteve koji su odobreni, radi prikazivanja slobodnih termina na kalendaru
  const fetchZahtevi = async () => {
    try {
      //Kreira zahtev
      if(stanodavacMejl){
      const response = await fetch('/api/ZahtevRuta/stanodavac/zahtevi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mejl: stanodavacMejl, status: 'Odobren' }) 
      });
      if (response.ok) {
        const data = await response.json();
        const filteredZahtevi = data.filter(
          zahtev => zahtev.nazivSmestaja === naziv && zahtev.nazivSmestajneJedinice === nazivSmestajneJedinice
        );
        const dates = [];
        filteredZahtevi.forEach(zahtev => {
          const start = adjustDateByOneDay(new Date(zahtev.datumOd));
          const end = adjustDateByOneDay(new Date(zahtev.datumDo));
          const currentDate = new Date(start);
          while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
        setReservedDates(dates);
      } else {
        console.error('Greška pri dobijanju zahteva');
      }
    }
    } catch (error) {
      console.error('Greška prilikom dobijanja zahteva:', error);
    }
  };

  useEffect(() => {
    fetchStanodavacMejl();
  }, [naziv, nazivSmestajneJedinice]);

  useEffect(() => {
    if (stanodavacMejl) {
      fetchZahtevi();
    }
  }, [stanodavacMejl]);

  const handleStartDateChange = date => {
    setWarning('');
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = date => {
    setWarning('');
    setEndDate(date);
  };

  const handleVaucerClick = () => {
    
    if (isSelectionValid()) {
      navigate(`/gost/pretraga/${naziv}/${nazivSmestajneJedinice}/rezervisi/vaucer`, { state: { startDate, endDate } });
    } else {
      setWarning('Odabrani period sadrži rezervisane datume.');
    }
  };

  const handlePlacanjeClick = () => {
    if (isSelectionValid()) {
      navigate(`/gost/pretraga/${naziv}/${nazivSmestajneJedinice}/rezervisi/placanje`, { state: { startDate, endDate } });
    } else {
      setWarning('Odabrani period sadrži rezervisane datume.');
    }
  };

  const isReserved = date => {
    return reservedDates.some(reservedDate => reservedDate.toDateString() === date.toDateString());
  };

  // Funkcija za dodavanje klase crvenim datumima
  const dayClassName = date => {
    return isReserved(date) ? 'red-date' : '';
  };

  const isSelectionValid = () => {
    if (!startDate || !endDate || !naziv || !nazivSmestajneJedinice) return false;
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (isReserved(currentDate)) {
        return false;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return true;
  };
  return (
    <div className='container-gost'>
      <h2>Rezervacija</h2>
      <div>
        <label>Početni datum:</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          placeholderText="Izaberite početni datum"
          filterDate={date => !isReserved(date)}
          dayClassName={dayClassName} 
        />
      </div>
      <div>
        <label>Krajnji datum:</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
          minDate={startDate}
          placeholderText="Izaberite krajnji datum"
          filterDate={date => !isReserved(date)}
          dayClassName={dayClassName} 
        />
      </div>
      {startDate && endDate && (
        <p>Odabrani interval: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
      )}
      <div className="button-container-rezervisi">
    <button disabled={!startDate || !endDate} onClick={handleVaucerClick}>
      Rezerviši vaučerom
    </button>
    <button disabled={!startDate || !endDate} onClick={handlePlacanjeClick}>
      Rezerviši plaćanjem
    </button>
  </div>
      {/* <button disabled={!startDate || !endDate} onClick={handleVaucerClick}>
        Rezerviši preko vaučera
      </button>
      <button disabled={!startDate || !endDate} onClick={handlePlacanjeClick}>
        Rezerviši plaćanjem
      </button> */}
      {warning && <p style={{ color: 'red' }}>{warning}</p>}
    </div>
  );
};

export default RezervisiGost;
