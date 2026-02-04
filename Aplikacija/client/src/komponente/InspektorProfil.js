// U GostProfil.js
import React, { useEffect, useState } from 'react';
//import { useGostContext } from '../hooks/useGostContext';
import {useInspektorContext} from '../hooks/useInspektorContext'
import { useAuthContext } from '../hooks/useAuthContext';

const InspektorProfil = () => {
    const { selectedInspektor, dispatch } = useInspektorContext();
    const { user } = useAuthContext();

    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [jmbg, setJmbg] = useState('');
    const [brojTelefona, setBrojTelefona] = useState('');
    const [mejl, setMejl] = useState('');
    const [id, setId] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchInspektorProfile = async () => {
            if (!user || !user.inspektorProfile?._id) {
                console.error("Invalid user data");
                return;
            }

            const response = await fetch(`/api/InspektorRuta/${user.inspektorProfile._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await response.json();
            if (response.ok) {
                dispatch({ type: 'SET_INSPEKTOR', payload: json });
                setIme(json.ime);
                setPrezime(json.prezime);
                setJmbg(json.jmbg);
                setBrojTelefona(json.brojTelefona);
                setMejl(json.mejl);
                setId(json.ID);
            } else {
                console.error("Failed to fetch inspektor profile:", json.error);
            }
        };

        fetchInspektorProfile();
    }, [user ,dispatch]);

    const handleSave = async () => {
        const updatedInspektor = {
            ime,
            prezime,
            jmbg,
            brojTelefona,
            mejl,
            id,
        };
        const response = await fetch(`/api/InspektorRuta/${jmbg}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(updatedInspektor)
        });

        const json = await response.json();
        if (response.ok) {
            //dispatch({ type: 'SET_GOST', payload: json });
            setIsEditing(false);
            alert("Profil uspešno ažuriran!");
        } else {
            console.error("Failed to update inspektor profile:", json.error);
        }
    };

   //if (!selectedInspektor) return <div>Loading...</div>;

    return (
        <div className="gost-profil">
            <h1>Profil Inspektora</h1>
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
                ID:
                {isEditing ? (
                    <input type="text" value={id} disabled={true} />
                ) : (
                    <span>{id}</span>
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
         
            {isEditing ? (
                <button onClick={handleSave}>Sačuvaj izmene</button>
            ) : (
                <button onClick={() => setIsEditing(true)}>Uredi</button>
            )}
        </div>
    );
};

export default InspektorProfil;



/*
const InspektorProfil = () => {

}

export default InspektorProfil*/