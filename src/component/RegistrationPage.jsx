import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError("Le password non corrispondono.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            setMessage("Registrazione avvenuta con successo! Ora puoi accedere.");
            setTimeout(() => {
                navigate('/login'); 
            }, 2000);
        } catch (err) {
            console.error("Errore di registrazione:", err);
            setError(err.message || "Errore durante la registrazione. Riprova.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>Registrazione</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="usernameInput" className="form-label">Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="usernameInput"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="emailInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="passwordInput" className="form-label">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="passwordInput"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPasswordInput" className="form-label">Conferma Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPasswordInput"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {message && <p className="text-success">{message}</p>}
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-primary w-100">Registrati</button>
            </form>
            <p className="mt-3 text-center">
                Hai già un account? <a href="/login">Accedi qui</a>
            </p>
        </div>
    );
};

export default RegistrationPage;