import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { MdPlace } from "react-icons/md";
import { FaHotel, FaCalendarAlt, FaStar, FaSearch } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { IoPersonSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Pretraga = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState('');
  const [numOfPersons, setNumOfPersons] = useState('');
  const [rating, setRating] = useState('');
  const [naselja, setNaselja] = useState([]);
  let nextPage = 1;
  let prvi = true;
  const today = new Date();

  const filterData = async () => {
    //Mesto
    //Cena
    //Broj osoba
    //Datum od
    //Datum do
    //Ocena
  };

  const handleNextPage = async () => {
    nextPage = nextPage + 1;
    await fetchAccommodations();
  };

  const handlePrevPage = async () => {
    prvi = false;
    nextPage = Math.max(nextPage - 1, 1); // Smanjite nextPage za 1, ali osigurajte da ne padne ispod 1
    await fetchAccommodations();
  };

  useEffect(() => {
    if (prvi) {
      fetchAccommodations();
    }
    fetchNaselja();
  }, []);


  const fetchAccommodations = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/SmestajRuta/' + nextPage, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setAccommodations(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch accommodations");
        setAccommodations([]);
      }
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      setAccommodations([]);
    }
  };

  const fetchNaselja = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/NaseljeRuta');
      if (response.ok) {
        const data = await response.json();
        setNaselja(data);
      } else {
        console.error("Failed to fetch naselja");
      }
    } catch (error) {
      console.error("Error fetching naselja:", error);
    }
  };

  const handleSearch = async () => {
    try {
      let oc = 0;
      let nop = 0;
      let cen = Number.MAX_SAFE_INTEGER;

      if (rating) oc = parseInt(rating);
      if (numOfPersons) nop = parseInt(numOfPersons);
      if (price) cen = parseInt(price);

      const response = await fetch('/api/SmestajRuta/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({ mesto: destination, ocena: oc, brojOsoba: nop, cena: cen })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAccommodations(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch accommodations");
        setAccommodations([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setAccommodations([]);
    }
  };

  const naseljeOptions = naselja.map(naselje => ({
    value: naselje.ime,
    label: naselje.ime
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: '100%'
    }),
    menu: (provided) => ({
      ...provided,
      width: '100%',
    }),
    container: (provided) => ({
      ...provided,
      width: '100%',
    })
  };

  return (
    <div className="pretraga-container">
      <div className="search-inputs">
        <div className="input-with-icon-combobox">
          <MdPlace className="input-icon" />
          <Select
            value={naseljeOptions.find(option => option.value === destination)}
            onChange={(selectedOption) => setDestination(selectedOption ? selectedOption.value : '')}
            options={naseljeOptions}
            placeholder="Turistička destinacija"
            isClearable
            styles={customStyles}
          />
        </div>
        <div className="search-input">
          <div className="input-with-icon">
            <GiMoneyStack className="input-icon" />
            <input
              type="number"
              placeholder="Cena"
              value={price}
              min="0"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="search-input">
          <div className="input-with-icon">
            <IoPersonSharp className="input-icon" />
            <input
              type="number"
              placeholder="Broj osoba"
              value={numOfPersons}
              min="0"
              onChange={(e) => setNumOfPersons(e.target.value)}
            />
          </div>
        </div>

        <div className="search-input">
          <div className="input-with-icon">
            <FaStar className="input-icon" />
            <input
              type="number"
              placeholder="Ocena"
              value={rating}
              min="0"
              max="5"
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="search-button-container">
        <button className="search-button" onClick={handleSearch}>
          <FaSearch className="button-icon" />
          Pretraga
        </button>
      </div>

      <h2>Rezultat pretrage je {accommodations.length} smeštaja</h2>
      <div className="search-results cardsWrapper">
        <div className="cards">
          {accommodations.length > 0 ? (
            accommodations.map((accommodation, index) => (
              <div key={index} className="card">
                <Link to={`${accommodation.naziv}`}>
                  <h3>{accommodation.naziv}</h3>
                </Link>
                <p>Mesto: {accommodation.naseljeIme + ', ' + accommodation.ulica}</p>
                <p>Broj soba: {accommodation.brojSoba}</p>
                <p>Udaljenost od centra: {
                  accommodation.udaljenostOdCentra >= 1000 ?
                    `${(accommodation.udaljenostOdCentra / 1000).toFixed(2)} km` :
                    `${accommodation.udaljenostOdCentra} m`
                }</p>
                <p>Dvoriste: {accommodation.dvoriste ? "Da" : "Ne"}</p>
                <p>Broj parking mesta: {accommodation.brojParkingMesta}</p>
                <p>Ocena: {accommodation.prosecnaOcena > 0 ? accommodation.prosecnaOcena : 'još uvek nema ocena'}</p>
              </div>
            ))
          ) : (
            <p>Nema dostupnih smeštaja.</p>
          )}
        </div>
      </div>
      <button onClick={handlePrevPage} disabled={nextPage === 1}>Prev Page</button>
      <button onClick={handleNextPage} disabled={accommodations.length < 10}>Next Page</button>
    </div>
  );
};

export default Pretraga;
