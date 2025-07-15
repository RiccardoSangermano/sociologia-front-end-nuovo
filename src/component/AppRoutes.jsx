import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import HomePage from './HomePage.jsx';
import TheoryDetail from './TheoryDetails.jsx';
import LoginPage from './LoginPage.jsx';
import RegistrationPage from './RegistrationPage.jsx';
import UserDashboard from './UserDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import UnauthorizedPage from './UnauthorizedPage.jsx';

const AboutPage = () => <div className="text-center mt-5"><h2>Chi Siamo</h2><p>Informazioni sulla Sociopedia.</p></div>;
const TheoriesOverviewPage = () => <div className="text-center mt-5"><h2>Teorie</h2><p>Pagina di riepilogo di tutte le teorie (potrebbe reindirizzare a Home).</p><HomePage/></div>;


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="theories/:id" element={<TheoryDetail />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegistrationPage />} />
                    <Route path="unauthorized" element={<UnauthorizedPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="theories" element={<TheoriesOverviewPage />} /> {/* Questa potrebbe anche semplicemente reindirizzare a '/' */}
                </Route>
                <Route path="/dashboard" element={<PrivateRoute roles={['ROLE_USERS', 'ROLE_ADMIN']} />}>
                    <Route index element={<UserDashboard />} />
                </Route>
                <Route path="/admin-dashboard" element={<PrivateRoute roles={['ROLE_ADMIN']} />}>
                    <Route index element={<AdminDashboard />} />
                </Route>
                <Route path="*" element={<p>404 - Pagina non trovata</p>} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;