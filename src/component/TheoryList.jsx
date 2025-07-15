import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TheoryList = ({ searchTerm }) => {
  console.log("TheoryList component is rendering!");
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTheories = () => {
    setLoading(true);
    setError(null);

    fetch('http://localhost:8080/api/theories')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Full API response (data object):", data);
        setTheories(data.content || data);
        console.log("'theories' state after setTheories:", data.content || data);
      })
      .catch(err => {
        console.error("Error loading theories:", err);
        setError("Impossibile caricare le teorie. Riprova più tardi.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  
  useEffect(() => {
    fetchTheories();
  }, []); 

  const filteredTheories = theories.filter(theory => {
    const nomeTeoria = theory.nomeTeoria ? theory.nomeTeoria.toLowerCase() : '';
    const autore = theory.autore ? theory.autore.toLowerCase() : '';
    const spiegazione = theory.spiegazione ? theory.spiegazione.toLowerCase() : '';
    const lowerCaseSearchTerm = searchTerm ? searchTerm.toLowerCase() : '';

    return (
      nomeTeoria.includes(lowerCaseSearchTerm) ||
      autore.includes(lowerCaseSearchTerm) ||
      spiegazione.includes(lowerCaseSearchTerm)
    );
  });

  if (loading) {
    return <p>Caricamento teorie...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Tutte le Teorie Sociologiche</h2>
      {filteredTheories.length === 0 ? (
        <p>Nessuna teoria trovata che corrisponda alla tua ricerca.</p>
      ) : (
        <ul>
          {filteredTheories.map(theory => (
            <li key={theory.id}>
              <Link to={`/theories/${theory.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>{theory.nomeTeoria}</h3>
                <p>Autore: {theory.autore}</p>
                <p>{theory.spiegazione ? theory.spiegazione.substring(0, 150) + '...' : ''}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TheoryList;
