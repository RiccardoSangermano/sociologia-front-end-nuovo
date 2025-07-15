import React from 'react';
import { useAuth } from './AuthContext.jsx';
import ManageTheories from "./ManageTheories.jsx";

const AdminDashboard = () => {
    const { user, roles } = useAuth();

    if (!user) {
        return <p>Caricamento dati utente...</p>;
    }

    return (
        <div>
            <h2>Dashboard Amministratore</h2>
            <p>Benvenuto, {user.username}! Sei loggato come amministratore.</p>
            <p>Email: {user.email}</p>
            <p>I tuoi ruoli: {roles.join(', ')}</p>

            <hr style={{ margin: '30px 0' }} />
            <ManageTheories />
        </div>
    );
};

export default AdminDashboard;