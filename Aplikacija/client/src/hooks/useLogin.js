import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const login = async (mejl, lozinka) => {
        setIsLoading(true);
        setError(null);

        const roles = ['GostRuta', 'StanodavacRuta', 'InspektorRuta'];
        for (const role of roles) {
            const response = await fetch(`/api/${role}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ mejl, lozinka })
            });
            const json = await response.json();

            console.log(`Login attempt for role ${role}:`, json); // Debug log

            if (response.ok) {
                json.role = role.toLowerCase().replace('ruta', '');
                localStorage.setItem('user', JSON.stringify(json));
                dispatch({ type: 'LOGIN', payload: json });
                setIsLoading(false);
                return { success: true, role: json.role };
            }
        }

        setError('Login failed for all roles');
        setIsLoading(false);
        return { success: false };
    };

    return { login, isLoading, error };
};