import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { login, isLoading, error } = useLogin();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMessage('Sva polja moraju biti uneta.');
            return;
        }

        const result = await login(email, password);

        console.log('Login result:', result); // Debug log

        if (result.success) {
            if (result.role === 'gost') {
                // navigate('/gost');
                navigate('/gost/pretraga');
            } else if (result.role === 'stanodavac') {
                navigate('/stanodavac/kalendar');
            } else if (result.role === 'inspektor') {
                navigate('/inspektor/stanodavci');
            }
        } else {
            setErrorMessage('Pogrešni podaci za prijavu.');
        }
    };

    const clearErrorMessage = () => {
        setErrorMessage('');
    };

    return (
        <form onSubmit={handleLogin}>
            {errorMessage && (
                <div className="error-message">
                    <FaExclamationCircle className="error-icon" />
                    <span>{errorMessage}</span>
                </div>
            )}
            <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={clearErrorMessage}
                    placeholder="Email"
                />
            </div>
            <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={clearErrorMessage}
                    placeholder="Šifra"
                />
                <button type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            <button type="submit" disabled={isLoading}>Prijavi se</button>
        </form>
    );
};

export default LoginForm;
