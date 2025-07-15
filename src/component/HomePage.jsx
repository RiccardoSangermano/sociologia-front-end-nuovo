import React from 'react'; 
import Container from 'react-bootstrap/Container';

function BasicExample({ onSearchChange, suggestions, onSelectSuggestion }) {
  return (
    <> 
      

      <Container className="mt-3 text-center">
        <img
          src="/images/sociologia.jpg" 
          alt="Immagine di Sociologia"
          className="img-fluid" 
          style={{ maxWidth: '100%', height: 'auto' }} 
        />
      </Container>
    </>
  );
}

export default BasicExample;