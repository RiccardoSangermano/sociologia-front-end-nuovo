import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            const fetchUserDetails = async () => {
                try {
                    const response = await fetch('http://localhost:8080/api/user/me', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        console.error("Errore HTTP nel recupero dei dettagli utente:", response.status, response.statusText);
                        localStorage.removeItem('jwt');
                        setUser(null);
                        setRoles([]);
                        return;
                    }

                    const data = await response.json();
                    setUser(data.user);
                    setRoles(data.roles ? data.roles.map(role => role.nome) : []);
                } catch (error) {
                    console.error("Errore nel recupero dei dettagli utente:", error);
                    localStorage.removeItem('jwt');
                    setUser(null);
                    setRoles([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserDetails();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (usernameOrEmail, password) => {
        try {
            // *** QUI È STATA FATTA LA MODIFICA: da /api/auth/login a /api/auth/signin ***
            const response = await fetch('http://localhost:8080/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usernameOrEmail, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Dettagli errore login:", errorData);
                throw new Error(errorData.message || `Login fallito: Errore HTTP! stato: ${response.status}`);
            }

            const responseData = await response.json();
            const token = responseData.accessToken;
            const userDetails = responseData.user;
            const userRoles = responseData.roles;

            localStorage.setItem('jwt', token);
            setUser(userDetails);
            setRoles(userRoles ? userRoles.map(role => role.nome) : []);
            return true;
        } catch (error) {
            console.error("Login fallito:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        setUser(null);
        setRoles([]);
    };

    const hasRole = (requiredRole) => {
        return roles.includes(requiredRole);
    };

    return (
        <AuthContext.Provider value={{ user, roles, loading, login, logout, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);