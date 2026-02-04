
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const Cards = ({ imeSmestaja }) => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [smestajneJedinice, setSmestajneJedinice] = useState([]);
  const [rating, setRating] = useState({});
  const [rated, setRated] = useState({});
  const [showRatingInputs, setShowRatingInputs] = useState(false);

  async function pronadjiSmestajneJedinice(imeSmestaja) {
    try {
      if (imeSmestaja != null) {
        const response = await fetch(`/api/SmestajnaJedinicaRuta/stranicenje/${imeSmestaja}/1`);
        if (response.ok) {
          const data = await response.json();
          setSmestajneJedinice(data);
          dispatch({ type: "GET_SMESTAJNA_JEDINICA", payload: data });
        } else {
          console.error("Greška pri dobijanju smestajne jedinice");
        }
      }
    } catch (error) {
      console.error("Greška prilikom pronalaženja smeštajnih jedinica:", error);
      throw error;
    }
  }

  const handleZahtevZaRezervaciju = (smestajnaJed) => {
    navigate(`/gost/pretraga/${smestajnaJed.imeSmestaja}/${smestajnaJed.imeJedinice}/rezervisi`);
  };

  const handleOceniClick = (id) => {
    setShowRatingInputs((prevState) => ({ ...prevState, [id]: true }));
    setRating((prevState) => ({ ...prevState, [id]: 0 }));
  };
  

  const handleRatingChange = (id, value) => {
    setRating((prevState) => ({ ...prevState, [id]: parseInt(value) }));
  };

  
  async function racunajProsecnuOcenuSmestaja(naziv) {
    try {

        console.log(naziv)
        if(naziv){
        const response = await fetch(`/api/SmestajRuta/prosecna-ocena/${naziv}`);
       
        if (!response.ok) {
          const data = response.json()
          console.error('Greška pri dobijanju smestajnih jedinica');
          dispatch({ type: "SET_SMESTAJ", payload: data });//Probao sam ovako
        }
    }
    } catch (error) {
        console.error('Greška pri dobijanju smestajnih jedinica:', error);
    }
}

  const handleSubmitRating = async (sj) => {
    try {
        const id = sj._id;
        
        const response = await fetch(`/api/SmestajnaJedinicaRuta/oceni/${sj._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: Math.round(rating[id] * 10) / 10 }),
      });

      if (response.ok) {
        const data = await response.json();
        setSmestajneJedinice((prevState) =>
          prevState.map((jedinica) =>
            jedinica._id === id ? { ...jedinica, prosecnaOcena: data.prosecnaOcena } : jedinica
          )
        );
        setRated((prevState) => ({ ...prevState, [id]: true }));
        setShowRatingInputs(false); // Sakrij numeric up down
        racunajProsecnuOcenuSmestaja(sj.imeSmestaja)
      } else {
        console.error("Greška pri ocenjivanju smestajne jedinice");
      }
    } catch (error) {
      console.error("Greška prilikom slanja ocene:", error);
    }
  };

  useEffect(() => {
    pronadjiSmestajneJedinice(imeSmestaja);
  }, [imeSmestaja]);

  return (
    <div className="cardsWrapper">
      <div className="cards">
        {smestajneJedinice.length === 0 && <p>No accommodation unit(s) found</p>}
        {smestajneJedinice.map((smestajnaJedinica) => {
          const isRated = rated[smestajnaJedinica._id];
          return (
            <div key={smestajnaJedinica._id} className="card">
              <h3>{smestajnaJedinica.imeJedinice}</h3>
              <div className="text">
                <p>
                  <span className="label">Broj sobe:</span>
                  <span className="info">{smestajnaJedinica.brojSobe}</span>
                </p>
                <p>
                  <span className="label">Broj kreveta:</span>
                  <span className="info">{smestajnaJedinica.brojKreveta}</span>
                </p>
                <p>
                  <span className="label">Kuhinja:</span>
                  <span className="info">{smestajnaJedinica.kuhinja ? "Da" : "Ne"}</span>
                </p>
                <p>
                  <span className="label">Wifi:</span>
                  <span className="info">{smestajnaJedinica.wifi ? "Da" : "Ne"}</span>
                </p>
                <p>
                  <span className="label">Televizor:</span>
                  <span className="info">{smestajnaJedinica.tv ? "Da" : "Ne"}</span>
                </p>
                <p>
                  <span className="label">Terasa:</span>
                  <span className="info">{smestajnaJedinica.terasa ? "Da" : "Ne"}</span>
                </p>
                <p>
                  <span className="label">Ocena:</span>
                  <span className="info">{smestajnaJedinica.prosecnaOcena}</span>
                </p>
                <p>
                  <span className="label">Cena:</span>
                  <span className="info">{smestajnaJedinica.cena} RSD</span>
                </p>
              </div>

              <div className="btnContainer">
                <button onClick={() => handleZahtevZaRezervaciju(smestajnaJedinica)}>Rezerviši</button>
                {!isRated && !showRatingInputs[smestajnaJedinica._id]? ( // Promenljivo prikazivanje dugmeta oceni ili numeric up down
                  <button onClick={() => handleOceniClick(smestajnaJedinica._id)}>Oceni</button>
                ) : (
                  <>
                    {showRatingInputs[smestajnaJedinica._id] && (
                      <>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={rating[smestajnaJedinica._id]}
                          onChange={(e) => handleRatingChange(smestajnaJedinica._id, e.target.value)}
                        />
                        <button onClick={() => handleSubmitRating(smestajnaJedinica)}>Prosledi</button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cards;