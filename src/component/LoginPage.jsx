import React, { useState } from 'react';
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        if (!username || !password) {
            setError("Per favore, inserisci sia username che password.");
            return;
        }

        const success = await login(username, password);
        if (success) {
            navigate('/dashboard'); 
        } else {
            setError("Login fallito. Controlla le credenziali o riprova più tardi.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>Login</h2>
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
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-primary w-100">Accedi</button>
            </form>
            <p className="mt-3 text-center">
                Non hai un account? <a href="/register">Registrati qui</a>
            </p>
        </div>
    );
};

export default LoginPage;