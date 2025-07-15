import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext.jsx";

const ManageTheories = () => {
    const { user } = useAuth();
    const [theories, setTheories] = useState([]);
    const [newTheory, setNewTheory] = useState({
        nomeTeoria: '',
        autore: '',
        immagineAutoreUrl: '',
        spiegazione: '',
        esempioApplicazioneModerna: ''
    });
    const [editingTheoryId, setEditingTheoryId] = useState(null);

    const token = localStorage.getItem('jwt');

    useEffect(() => {
        if (token) {
            fetchTheories();
        }
    }, [token]);

    const fetchTheories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/theories', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // *** MODIFICA QUI: Gestisci la risposta paginata (se presente) ***
            setTheories(data.content || data);
        } catch (error) {
            console.error("Errore nel recupero delle teorie per l'amministrazione:", error);
            alert('Impossibile recuperare le teorie. Potrebbe essere un problema di accesso o del server.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTheory(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editingTheoryId) {
                response = await fetch(`http://localhost:8080/api/theories/${editingTheoryId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newTheory) 
                });
            } else {
                response = await fetch('http://localhost:8080/api/theories', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newTheory) 
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            alert(editingTheoryId ? 'Teoria modificata con successo!' : 'Teoria aggiunta con successo!');
            
            setNewTheory({
                nomeTeoria: '', autore: '', immagineAutoreUrl: '', spiegazione: '', esempioApplicazioneModerna: ''
            });
            setEditingTheoryId(null);
            fetchTheories();
        } catch (error) {
            console.error("Errore nell'operazione sulla teoria:", error);
            alert('Errore nell\'operazione: ' + error.message);
        }
    };

    const handleEdit = (theory) => {
        
        setNewTheory(theory);
        setEditingTheoryId(theory.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questa teoria? Questa azione è irreversibile!')) {
            try {
                const response = await fetch(`http://localhost:8080/api/theories/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                alert('Teoria eliminata con successo!');
                fetchTheories();
            } catch (error) {
                console.error("Errore nell'eliminazione della teoria:", error);
                alert('Errore nell\'eliminazione: ' + error.message);
            }
        }
    };

    return (
        <div>
            <h3>{editingTheoryId ? 'Modifica Teoria Esistente' : 'Aggiungi Nuova Teoria'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '600px', margin: 'auto' }}>
                {/* *** MODIFICA QUI: I nomi degli attributi 'name' devono corrispondere ai campi del backend *** */}
                <input type="text" name="nomeTeoria" value={newTheory.nomeTeoria} onChange={handleChange} placeholder="Nome Teoria" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" name="autore" value={newTheory.autore} onChange={handleChange} placeholder="Autore" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" name="immagineAutoreUrl" value={newTheory.immagineAutoreUrl} onChange={handleChange} placeholder="URL Immagine Autore (opzionale)" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <textarea name="spiegazione" value={newTheory.spiegazione} onChange={handleChange} placeholder="Spiegazione Dettagliata" required rows="5" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
                <textarea name="esempioApplicazioneModerna" value={newTheory.esempioApplicazioneModerna} onChange={handleChange} placeholder="Esempio di Applicazione Moderna (opzionale)" rows="3" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
                <button type="submit" className="btn btn-primary">
                    {editingTheoryId ? 'Salva Modifiche' : 'Aggiungi Teoria'}
                </button>
                {editingTheoryId && (
                    <button type="button" className="btn btn-secondary" onClick={() => {
                        setEditingTheoryId(null);
                        setNewTheory({ nomeTeoria: '', autore: '', immagineAutoreUrl: '', spiegazione: '', esempioApplicazioneModerna: '' });
                    }}>
                        Annulla Modifica
                    </button>
                )}
            </form>

            <hr style={{ margin: '40px 0' }} />

            <h3>Lista delle Teorie Gestibili</h3>
            {theories.length === 0 ? (
                <p>Nessuna teoria presente per la gestione.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {theories.map(theory => (
                        <li key={theory.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '1px solid #eee', marginBottom: '8px', borderRadius: '4px' }}>
                            {/* *** MODIFICA QUI: Usa i nomi dei campi corretti per la visualizzazione *** */}
                            <span><strong>{theory.nomeTeoria}</strong> di {theory.autore}</span>
                            <div>
                                <button onClick={() => handleEdit(theory)} className="btn btn-warning btn-sm me-2">Modifica</button>
                                <button onClick={() => handleDelete(theory.id)} className="btn btn-danger btn-sm">Elimina</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManageTheories;