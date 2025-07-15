import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "./AuthContext.jsx";

const PrivateRoute = ({ roles }) => {
    const { user, loading, hasRole } = useAuth();

    if (loading) {
        return <div>Caricamento...</div>; 
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    const isAuthorized = roles.some(role => hasRole(role));

    if (!isAuthorized) {

        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;