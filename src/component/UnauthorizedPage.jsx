
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Accesso Non Autorizzato</h1>
            <p>Non hai i permessi necessari per visualizzare questa pagina.</p>
            <Link to="/" className="btn btn-primary">Torna alla Home</Link>
        </div>
    );
};

export default UnauthorizedPage;