import React, { useState } from 'react';

const Kalendar = () => {
  // Funkcija za generisanje brojeva od 1 do n
  const generateNumbers = (n) => {
    return Array.from({ length: n }, (_, i) => i + 1);
  };

  // Trenutni datum
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const today = currentDate.getDate();

  // Broj dana u mesecu i prvog dana u nedelji
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Niz dana u nedelji
  const daysOfWeek = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'];

  // Niz brojeva od 1 do broja dana u mesecu
  const daysOfMonth = generateNumbers(daysInMonth);

  // Niz za prikaz kalendara
  const calendar = [];

  // Dodavanje praznih polja za dane pre prvog dana u mesecu
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendar.push(null);
  }

  // Dodavanje dana u mesecu u kalendar
  daysOfMonth.forEach((day) => {
    calendar.push(day);
  });

  // Stanje za izabranu sobu
  const [selectedRoom, setSelectedRoom] = useState('soba1');

  // Funkcija za promenu izabrane sobe
  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
  };

  // Funkcija za navigaciju na prethodni mesec
  const prevMonth = () => {
    // Implementirati navigaciju na prethodni mesec
  };

  // Funkcija za navigaciju na sledeći mesec
  const nextMonth = () => {
    // Implementirati navigaciju na sledeći mesec
  };

  return (
    <div className="calendar-container">
      <select value={selectedRoom} onChange={handleRoomChange}>
        <option value="soba1">Soba 1</option>
        <option value="soba2">Soba 2</option>
        <option value="soba3">Soba 3</option>
      </select>
      <h2>{currentYear}. {currentMonth + 1}.</h2>
      <div className="navigation">
        <button onClick={prevMonth}>Prethodni mesec</button>
        <button onClick={nextMonth}>Sledeći mesec</button>
      </div>
      <div className="days-of-week">
        {daysOfWeek.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {calendar.map((day, index) => (
          <div key={index} className={day === today ? 'calendar-day today' : 'calendar-day'}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kalendar;

/*import React from 'react';
//import './Kalendar.css';

const Kalendar = () => {
  // Funkcija za generisanje brojeva od 1 do n
  const generateNumbers = (n) => {
    return Array.from({ length: n }, (_, i) => i + 1);
  };

  // Trenutni datum
  const currentYear = new Date().getFullYear();

  // Niz meseci
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="year-calendar-container">
      <h2>Kalendar za {currentYear}.</h2>
      <div className="year-calendar">
        {months.map((month) => (
          <Month key={month} year={currentYear} month={month} />
        ))}
      </div>
    </div>
  );
};

const Month = ({ year, month }) => {
  // Funkcija za generisanje brojeva od 1 do n
  const generateNumbers = (n) => {
    return Array.from({ length: n }, (_, i) => i + 1);
  };

  // Broj dana u mesecu i prvog dana u nedelji
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Niz dana u nedelji
  const daysOfWeek = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'];

  // Niz brojeva od 1 do broja dana u mesecu
  const daysOfMonth = generateNumbers(daysInMonth);

  // Niz za prikaz kalendara
  const calendar = [];

  // Dodavanje praznih polja za dane pre prvog dana u mesecu
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendar.push(null);
  }

  // Dodavanje dana u mesecu u kalendar
  daysOfMonth.forEach((day) => {
    calendar.push(day);
  });

  return (
    <div className="month-calendar">
      <h3>{month + 1}.</h3>
      <div className="days-of-week">
        {daysOfWeek.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {calendar.map((day, index) => (
          <div key={index} className={day ? 'calendar-day' : 'empty-day'}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kalendar;*/

/*import React, { useState } from 'react';
//import './Kalendar.css';

const Kalendar = () => {
  // Funkcija za generisanje brojeva od 1 do n
  const generateNumbers = (n) => {
    return Array.from({ length: n }, (_, i) => i + 1);
  };

  // Trenutni datum
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Broj dana u mesecu i prvog dana u nedelji
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Niz dana u nedelji
  const daysOfWeek = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'];

  // Niz brojeva od 1 do broja dana u mesecu
  const daysOfMonth = generateNumbers(daysInMonth);

  // Niz za prikaz kalendara
  const calendar = [];

  // Dodavanje praznih polja za dane pre prvog dana u mesecu
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendar.push(null);
  }

  // Dodavanje dana u mesecu u kalendar
  daysOfMonth.forEach((day) => {
    calendar.push(day);
  });

  return (
    <div className="calendar-container">
      <h2>{currentYear}. {currentMonth + 1}.</h2>
      <div className="days-of-week">
        {daysOfWeek.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {calendar.map((day, index) => (
          <div key={index} className={day ? 'calendar-day' : 'empty-day'}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kalendar;*/
