import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "./AuthContext.jsx";
import SearchBar from './SearchBar';
import { FaGlobe } from 'react-icons/fa';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

const AppLayout = () => {
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // The SearchBar should only appear on the homepage (or wherever you define it)
    const showSearchBar = location.pathname === '/';

    // Handler for search term changes, including fetching suggestions
    const handleSearchTermChange = async (term) => {
        setSearchTerm(term); // Update the global searchTerm state

        // Fetch suggestions if the term is long enough (e.g., > 2 characters)
        // or if the search bar is cleared (term.length === 0) to potentially show all results
        if (term.length > 2 || term.length === 0) {
            setLoadingSuggestions(true);
            try {
                // IMPORTANT: Call your existing generic GET endpoint with the 'keyword' parameter.
                // This prevents the "For input string: 'suggestions'" error by using the correct API.
                const response = await fetch(`http://localhost:8080/api/theories?keyword=${encodeURIComponent(term)}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Assuming data.content contains an array of theory objects,
                // map them to just their names for the suggestions list.
                setSuggestions(data.content.map(theory => theory.nomeTeoria));
            } catch (err) {
                console.error("Error fetching suggestions:", err);
                setSuggestions([]); // Clear suggestions on error
            } finally {
                setLoadingSuggestions(false);
            }
        } else {
            setSuggestions([]); // Clear suggestions if the term is too short
        }
    };

    // Handler when a suggestion is clicked in the SearchBar
    const handleSelectSuggestion = (suggestion) => {
        setSearchTerm(suggestion); // Set the search bar input to the selected suggestion
        setSuggestions([]); // Clear suggestions after selection to hide the dropdown
        // Optionally, if you have theory IDs associated with suggestions, you could
        // navigate to a specific theory detail page here, e.g., navigate(`/theories/${suggestionId}`);
    };

    return (
        <div>
            <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <FaGlobe className="me-2" />
                        Sociology
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/about">Chi siamo</Nav.Link>
                            
                            {user && (
                                <Nav.Link as={Link} to="/dashboard">Dashboard Utente</Nav.Link>
                            )}
                            {user && hasRole('ROLE_ADMIN') && (
                                <Nav.Link as={Link} to="/admin-dashboard">Dashboard Admin</Nav.Link>
                            )}
                        </Nav>

                        {showSearchBar && (
                            <div className="d-flex me-3">
                                {/* Pass the correct props expected by SearchBar */}
                                <SearchBar
                                    onSearchChange={handleSearchTermChange}
                                    suggestions={suggestions}
                                    onSelectSuggestion={handleSelectSuggestion}
                                    loading={loadingSuggestions}
                                />
                            </div>
                        )}

                        <Nav>
                            {user ? (
                                <>
                                    <Navbar.Text className="me-2">Benvenuto, {user.username}!</Navbar.Text>
                                    <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    <Nav.Link as={Link} to="/register">Registrati</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="container mt-4">
                {/* The searchTerm is passed to Outlet to be accessible by child routes */}
                <Outlet context={{ searchTerm }} />
            </div>
        </div>
    );
};

export default AppLayout;