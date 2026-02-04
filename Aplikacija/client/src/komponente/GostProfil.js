// U GostProfil.js
import React, { useEffect, useState } from 'react';
import { useGostContext } from '../hooks/useGostContext';
import { useAuthContext } from '../hooks/useAuthContext';
import NajboljeOcenjeniSmestaji from './NajboljeOcenjeniSmestaji'
const GostProfil = () => {
    const { selectedGost, dispatch } = useGostContext();
    const { user } = useAuthContext();

    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [jmbg, setJmbg] = useState('');
    const [mestoPrebivalista, setMestoPrebivalista] = useState('');
    const [brojTelefona, setBrojTelefona] = useState('');
    const [mejl, setMejl] = useState('');
    const [ocena, setOcena] = useState(0);
    const [poseceneLokacije, setPoseceneLokacije] = useState([]);
    const [brojKartice, setBrojKartice] = useState('');
    const [vaziDo, setVaziDo] = useState('');
    const [cvcKod, setCvcKod] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchGostProfile = async () => {
            if (!user || !user.guestProfile?._id) {
                console.error("Invalid user data");
                return;
            }

            const response = await fetch(`/api/GostRuta/${user.guestProfile._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await response.json();
            if (response.ok) {
                dispatch({ type: 'SET_GOST', payload: json });
                setIme(json.ime);
                setPrezime(json.prezime);
                setJmbg(json.jmbg);
                setMestoPrebivalista(json.mestoPrebivalista);
                setBrojTelefona(json.brojTelefona);
                setMejl(json.mejl);
                setOcena(json.ocena);
                setPoseceneLokacije(json.poseceneLokacije);
                setBrojKartice(json.brojKartice);
                setVaziDo(json.vaziDo);
                setCvcKod(json.cvcKod);
            } else {
                console.error("Failed to fetch guest profile:", json.error);
            }
        };

        fetchGostProfile();
    }, [user, dispatch]);

    const handleSave = async () => {
        const updatedGost = {
            ime,
            prezime,
            jmbg,
            mestoPrebivalista,
            brojTelefona,
            mejl,
            brojKartice,
            vaziDo,
            cvcKod
        };
        const response = await fetch(`/api/GostRuta/${jmbg}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(updatedGost)
        });

        const json = await response.json();
        if (response.ok) {
            //dispatch({ type: 'SET_GOST', payload: json });
            setIsEditing(false);
            alert("Profil uspešno ažuriran!");
        } else {
            console.error("Failed to update guest profile:", json.error);
        }
    };

    if (!selectedGost) return <div>Loading...</div>;

    return (
        <div className="gost-profil">
            <h1>Profil Gosta</h1>
            <label>
                Ime:
                {isEditing ? (
                    <input type="text" value={ime} onChange={(e) => setIme(e.target.value)} />
                ) : (
                    <span>{ime}</span>
                )}
            </label>
            <label>
                Prezime:
                {isEditing ? (
                    <input type="text" value={prezime} onChange={(e) => setPrezime(e.target.value)} />
                ) : (
                    <span>{prezime}</span>
                )}
            </label>
            <label>
                JMBG:
                {isEditing ? (
                    <input type="text" value={jmbg} disabled={true} />
                ) : (
                    <span>{jmbg}</span>
                )}
            </label>
            <label>
                Mesto Prebivališta:
                {isEditing ? (
                    <input type="text" value={mestoPrebivalista} onChange={(e) => setMestoPrebivalista(e.target.value)} />
                ) : (
                    <span>{mestoPrebivalista}</span>
                )}
            </label>
            <label>
                Broj Telefona:
                {isEditing ? (
                    <input type="text" value={brojTelefona} onChange={(e) => setBrojTelefona(e.target.value)} />
                ) : (
                    <span>{brojTelefona}</span>
                )}
            </label>
            <label>
                Email:
                {isEditing ? (
                    <input type="text" value={mejl} onChange={(e) => setMejl(e.target.value)} />
                ) : (
                    <span>{mejl}</span>
                )}
            </label>
            <label>
                Ocena:
                {isEditing ? (
                    <input type="text" value={ocena} disabled={true}/>
                ) : (
                    <span>{ocena}</span>
                )}
            </label>
            <label>
                Broj Kartice:
                {isEditing ? (
                    <input type="text" value={brojKartice} onChange={(e) => setBrojKartice(e.target.value)} />
                ) : (
                    <span>{brojKartice}</span>
                )}
            </label>
            <label>
    Važi Do:
    {isEditing ? (
        <input 
            type="text" 
            value={vaziDo} 
            onChange={(e) => setVaziDo(e.target.value)} 
            placeholder="mm/yy" // Dodajte placeholder za unos
        />
    ) : (
        <span>{`${(new Date(vaziDo).getMonth() + 1).toString().padStart(2, '0')}/${new Date(vaziDo).getFullYear().toString().slice(2)}`}</span>
    )}
</label>
            <label>
                CVC Kod:
                {isEditing ? (
                    <input type="text" value={cvcKod} onChange={(e) => setCvcKod(e.target.value)} />
                ) : (
                    <span>{cvcKod}</span>
                )}
            </label>
            {isEditing ? (
                <button onClick={handleSave}>Sačuvaj izmene</button>
            ) : (
                <button onClick={() => setIsEditing(true)}>Uredi</button>
            )}
        </div>
    );
};

export default GostProfil;
