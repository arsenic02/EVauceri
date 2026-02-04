//V8
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { format } from 'date-fns';

const CalendarComponent = () => {
  const [selectedsmestaj, setSelectedsmestaj] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [filteredZahtevi, setFilteredZahtevi] = useState([]);
  const { user, smestaji = [], smestajneJedinice = [], zahtevi = [], dispatch } = useAuthContext();
  const boje = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#FFFF33', '#00FFFF', '#FF9933', '#9933FF', '#33FFFF', '#FF33CC', '#66FF33', '#33FF99', '#FF3366', '#33FFCC'
  ];

  const fetchSmestaji = async () => {
    try {
      if (user && user.stanodavacProfile) {
        const response = await fetch('/api/SmestajRuta/' + user.stanodavacProfile.mejl);
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'SET_SMESTAJI', payload: data });
          if (!selectedsmestaj) {
            const defaultSmestaj = data[0]?.naziv;
            setSelectedsmestaj(defaultSmestaj);
            fetchSmestajneJedinice(defaultSmestaj);
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
      const response = await fetch('/api/SmestajnaJedinicaRuta/smestaj/smestajne-jedinice/' + nazivSmestaja);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'SET_SMESTAJNE_JEDINICE', payload: data });
        const defaultUnit = data[0]?.imeJedinice;
        setSelectedUnit(defaultUnit);
        filterZahtevi(nazivSmestaja, defaultUnit);
      } else {
        console.error('Greška pri dobijanju smestajnih jedinica');
      }
    } catch (error) {
      console.error('Greška prilikom dobijanja smestajnih jedinica:', error);
    }
  };

  const fetchZahtevi = async () => {
    try {
      const response = await fetch('/api/ZahtevRuta/stanodavac/zahtevi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mejl: user.stanodavacProfile.mejl, status: "Odobren" })
      });
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'SET_ZAHTEVI', payload: data });
      } else {
        console.error('Greška pri dobijanju zahteva');
      }
    } catch (error) {
      console.error('Greška prilikom dobijanja zahteva:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchZahtevi();
      fetchSmestaji();
    }
  }, [user]);

  useEffect(() => {
    if (selectedsmestaj) {
      fetchSmestajneJedinice(selectedsmestaj);
    }
  }, [selectedsmestaj]);

  useEffect(() => {
    if (selectedUnit) {
      filterZahtevi(selectedsmestaj, selectedUnit);
    }
  }, [zahtevi, selectedsmestaj, selectedUnit]);

  const filterZahtevi = (smestaj, jedinica) => {
    const filtered = zahtevi.filter(zahtev => zahtev.nazivSmestaja === smestaj && zahtev.nazivSmestajneJedinice === jedinica);
    setFilteredZahtevi(filtered);
  };

  const renderDayContents = (day, date) => {
    const hitIndex = filteredZahtevi.findIndex(zahtev => {
      const zahtevStartDate = new Date(zahtev.datumOd);
      const zahtevEndDate = new Date(zahtev.datumDo);

      zahtevStartDate.setDate(zahtevStartDate.getDate() - 1);
    zahtevEndDate.setDate(zahtevEndDate.getDate() - 1);

      return date >= zahtevStartDate && date <= zahtevEndDate;
    });

    if (hitIndex !== -1) {
      const backgroundColor = boje[hitIndex % boje.length];
      return (
        <div style={{ backgroundColor, color: 'black', borderRadius: '50%', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span title={`${filteredZahtevi[hitIndex].imeGosta} ${filteredZahtevi[hitIndex].prezimeGosta}`}>{day}</span>
        </div>
      );
    }
    return day;
  };

  const handleSelectSmestaj = (smestaj) => {
    setSelectedsmestaj(smestaj);
  };

  const handleSelectSmestajnaJedinica = (unit) => {
    setSelectedUnit(unit);
  };

  return (
    <div>
      <select value={selectedsmestaj} onChange={e => handleSelectSmestaj(e.target.value)}>
        {smestaji.map((smestaj, index) => (
          <option key={index} value={smestaj.naziv}>{smestaj.naziv}</option>
        ))}
      </select>

      <select value={selectedUnit} onChange={e => handleSelectSmestajnaJedinica(e.target.value)}>
        {smestajneJedinice.map((jedinica, index) => (
          <option key={index} value={jedinica.imeJedinice}>{jedinica.imeJedinice}</option>
        ))}
      </select>

      <h2>{format(selectedMonth, 'MMMM yyyy')}</h2>
      <DatePicker
        selected={selectedMonth}
        onChange={date => setSelectedMonth(date)}
        inline
        renderDayContents={renderDayContents}
        calendarClassName="custom-calendar"
      />

      <div>
        Legenda:<br />
        Prelazom kursora miša preko termina, dobija se informacije o tome ko je zakazao termin.
      </div>
    </div>
  );
};

export default CalendarComponent;


