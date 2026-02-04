

//radi kod, ali samo za cuvanje state-a prilikom refreshovanja
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useGostContext } from "./useGostContext";
import { useStanodavacContext } from "./useStanodavacContext";
import { useInspektorContext } from "./useInspektorContext";

export const useRegister = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch: authDispatch } = useAuthContext();
  const { dispatch: dispatchGost } = useGostContext();
  const { dispatch: dispatchStanodavac } = useStanodavacContext();
  const { dispatch: dispatchInspektor } = useInspektorContext();

  const handleResponse = (json) => {
    localStorage.setItem('user', JSON.stringify(json));
    authDispatch({ type: 'LOGIN', payload: json });
    if (json.role === "gost") {
      dispatchGost({ type: 'LOGIN-GOST', payload: json });
    } else if (json.role === "stanodavac") {
      dispatchStanodavac({ type: 'LOGIN-STANODAVAC', payload: json });
    } else if (json.role === "inspektor") {
      dispatchInspektor({ type: 'LOGIN-INSPEKTOR', payload: json });
    }
  };

  const registerGost = async (ime, prezime, jmbg, mesto, tel, email, password, brojKartice, vaziDo, CVC) => {
    const response = await fetch('/api/GostRuta/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ime, prezime, jmbg, mestoPrebivalista: mesto, brojTelefona: tel, mejl: email, ocena: 0, poseceneLokacije: " ", brojKartice, vaziDo, cvcKod: CVC, lozinka: password })
    });
    const json = await response.json();
    json.role = "gost"
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    } else {
      handleResponse(json);
      setIsLoading(false);
    }
  };

  const registerStanodavac = async (ime, prezime, jmbg, ID, tel, email, password, brojKartice, vaziDo, CVC) => {
    const response = await fetch('/api/StanodavacRuta/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ime, prezime, jmbg, ID, brojTelefona: tel, mejl: email, ocena: 0, brojKartice, vaziDo, cvcKod: CVC, lozinka: password, ocene: [] })
    });
    const json = await response.json();
    json.role = "stanodavac"
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    } else {
      handleResponse(json);
      setIsLoading(false);
    }
  };

  const registerInspektor = async (ime, prezime, jmbg, ID, brojTelefona, mejl, lozinka) => {
    const response = await fetch('/api/InspektorRuta/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ime, prezime, jmbg, ID, brojTelefona, mejl, lozinka })
    });
    const json = await response.json();
    json.role = "inspektor"
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    } else {
      handleResponse(json);
      setIsLoading(false);
    }
  };

  return { registerGost, registerStanodavac, registerInspektor, isLoading, error };
};