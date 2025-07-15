import React from 'react';
import TheoryList from '../components/TheoryList';
import { useOutletContext } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

const HomePage = () => {
    const { searchTerm } = useOutletContext();

    return (
        <div>
            
            <Container className="mt-3 text-center">
                <img
                    src="/images/sociologia.jpg"
                    alt="Immagine di Sociologia"
                    className="img-fluid"
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
            </Container>

            <h1 className="mt-4 text-center">Benvenuto nella Sociopedia!</h1>
            <p className="text-center mb-4">Esplora le principali teorie sociologiche e scopri il mondo della sociologia.</p>

            <TheoryList searchTerm={searchTerm} />
        </div>
    );
};

export default HomePage;