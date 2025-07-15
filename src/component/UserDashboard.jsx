import React from 'react';
import { useAuth } from './AuthContext.jsx';

const UserDashboard = () => {
    const { user, roles } = useAuth();

    if (!user) {
        return <p>Caricamento dati utente...</p>;
    }

    return (
        <div>
            <h2>Dashboard Utente</h2>
            <p>Benvenuto, {user.username}!</p>
            <p>Email: {user.email}</p>
            <p>I tuoi ruoli: {roles.join(', ')}</p>
            <p>Qui potrai vedere contenuti o funzionalità riservate agli utenti loggati.</p>
        </div>
    );
};

export default UserDashboard;