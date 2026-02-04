import React, { useState, useEffect } from "react";
import Cards from "../komponente/GostPrikazivanjeSmestajneJedinice";
import PrikazivanjeSmestaja from "../komponente/GostPrikazivanjeSmestaja";
import { useLocation } from 'react-router-dom';


const Gost = () => {
    const [imeSmestaja, setImeSmestaja] = useState(null);
    const location = useLocation();
    const segment = location.pathname.split('/').pop();;
    useEffect(() => {
        // Simulacija asinhronog poziva ili nekog procesa
        let lastSegment = decodeURIComponent(segment);
            setImeSmestaja(lastSegment);
    }, []);
    return (
        <div>
            <PrikazivanjeSmestaja />
            <Cards imeSmestaja={imeSmestaja} />
        </div>
    );
};

export default Gost;
