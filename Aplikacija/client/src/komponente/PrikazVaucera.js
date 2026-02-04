import React, { useState , useEffect} from 'react';
import QRCode from 'qrcode.react';
import { useAuthContext } from '../hooks/useAuthContext';

const PrikaziVaucer = () => {
    const [vaucer, setVoucher] = useState("");
    const [qrCode, setQrCode] = useState('');
    const { user } = useAuthContext();

    useEffect(()=>{

        PrikaziVaucer();
    })
 

    const PrikaziVaucer = async () => {
        try {
            if(user && user.guestProfile.jmbg)
            {
            const response = await fetch('/api/VaucerRuta/vaucer-gost', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },              
                body: JSON.stringify({jmbg: user.guestProfile.jmbg})
            });

            if(response.ok){         
                const data = await response.json();
                setVoucher(data);  
                setQrCode(data.qrCode);      
            }
            else{
                console.error('Greska pri dobavljanju vaucera:');
            }
        }
           
        } catch (error) {
            console.error('Error creating vaucer:', error);
        }
    };

    return (
        <div>
            {vaucer && (
             <div className="gost-profil">
                <h1>Informacije o vaučeru</h1>
            <p>JBV: {vaucer.jbv}</p>
            <p>Ime: {vaucer.ime}</p>
            <p>Prezime: {vaucer.prezime}</p>
            <p>JMBG: {vaucer.jmbg}</p>
            <p>Naziv smeštaja: {vaucer.nazivSmestaja}</p>
            <p>Naziv smeštajne jedinice: {vaucer.nazivSmestajneJedinice}</p>
            <p>Mesto: {vaucer.mesto}</p>
            <p>Ulica: {vaucer.ulica}</p>
            <p>Datum od: {vaucer.datumOd}</p>
            <p>Datum do: {vaucer.datumDo}</p>
            { qrCode && (
                <div>                      
             <QRCode value={qrCode} size={512} />             
                </div>
            )}
            
            </div>)}

            {!vaucer && (
             <div className="gost-profil">
                <h1>Informacije o vaučeru</h1>
                 <p>Trenutno nemate ni jedan aktivan vaučer</p>
            </div>
            )}
        </div>
    );
};

export default PrikaziVaucer;