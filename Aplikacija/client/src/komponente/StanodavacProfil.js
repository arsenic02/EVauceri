import React, { useEffect, useState } from 'react';
import { useStanodavacContext } from '../hooks/useStanodavacContext';
import { useAuthContext } from '../hooks/useAuthContext';

const StanodavacProfil = () => {
    const { selectedStanodavac, dispatch } = useStanodavacContext();
    const { user } = useAuthContext();

    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [jmbg, setJmbg] = useState('');
    const [mestoPrebivalista, setMestoPrebivalista] = useState('');
    const [brojTelefona, setBrojTelefona] = useState('');
    const [mejl, setMejl] = useState('');
    const [brojKartice, setBrojKartice] = useState('');
    const [vaziDo, setVaziDo] = useState('');
    const [cvcKod, setCvcKod] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchStanodavacProfile = async () => {
            if (!user  || !user.stanodavacProfile?._id) {
              console.error("User is not defined");
              return;
            }
           
            const response = await fetch(`/api/StanodavacRuta/${user.stanodavacProfile._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await response.json();
            if (response.ok) {
                dispatch({ type: 'SET_STANODAVAC', payload: json });
                setIme(json.ime);
                setPrezime(json.prezime);
                setJmbg(json.jmbg);
                setMestoPrebivalista(json.mestoPrebivalista);
                setBrojTelefona(json.brojTelefona);
                setMejl(json.mejl);
                setBrojKartice(json.brojKartice);
                setVaziDo(json.vaziDo);
                setCvcKod(json.cvcKod);
            } else {
              console.error("Failed to fetch stanodavac profile:", json.error);
            }
        };

        fetchStanodavacProfile();
    }, [user, dispatch]);

    const handleSave = async () => {
        const updatedStanodavac= {
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
        const response = await fetch(`/api/StanodavacRuta/${jmbg}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(updatedStanodavac)
        });

        const json = await response.json();
        if (response.ok) {
            //dispatch({ type: 'SET_GOST', payload: json });
            setIsEditing(false);
            alert("Profil uspešno ažuriran!");
        } else {
            console.error("Failed to update stanodavac profile:", json.error);
        }
    };

    if (!selectedStanodavac) return <div>Loading...</div>;


    return (
        <div className="gost-profil">
            <h1>Profil Stanodavca</h1>
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

export default StanodavacProfil;

