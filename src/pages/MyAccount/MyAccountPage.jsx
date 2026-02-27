import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext/authContext';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // We vullen de state direct bij het laden van de pagina
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return user || (savedUser ? JSON.parse(savedUser) : null);
    });

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        // Gebruik de vastgestelde currentUser om orders te zoeken
        if (currentUser && currentUser.id) {
            axios.get(`http://localhost:5000/users-orders?userId=${currentUser.id}`)
                .then(res => {
                    setOrders(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Fout bij ophalen orders:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [currentUser]); // De lijst ververst als currentUser wijzigt

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) return setMsg("Wachtwoorden komen niet overeen.");
        
        try {
            await axios.patch(`http://localhost:5000/users/${currentUser.id}`, { password: passwords.new });
            setMsg("Wachtwoord succesvol gewijzigd!");
            setPasswords({ old: '', new: '', confirm: '' });
        } catch (err) {
            setMsg("Er is iets misgegaan.");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Weet je zeker dat je je account wilt verwijderen?")) {
            try {
                await axios.delete(`http://localhost:5000/users/${currentUser.id}`);
                alert("Account verwijderd.");
                logout();
                navigate('/');
            } catch (err) {
                alert("Verwijderen mislukt.");
            }
        }
    };

    // Toon een laadschermpje zolang we niet weten of er een user is
    if (loading && !currentUser) return <div className="container">Laden...</div>;

    // Pas als we klaar zijn met laden en er is geen user, tonen we de melding
    if (!loading && !currentUser) return <div className="container">Log eerst in om deze pagina te bekijken.</div>;

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h1>Mijn Account</h1>
            <p>Welkom, <strong>{currentUser.username}</strong> ({currentUser.email})</p>

            {/* SECTIE 1: Bestelgeschiedenis met Dropdown */}
<section style={{ marginTop: '40px' }}>
    <h2>Mijn Bestellingen</h2>
    {loading ? <p>Bestellingen laden...</p> : orders.length > 0 ? (
        orders.map(order => (
            <details key={order.id} style={{ 
                border: '1px solid #ddd', 
                marginBottom: '10px', 
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <summary style={{ 
                    padding: '15px', 
                    backgroundColor: '#f9f9f9', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>Order #{order.id} — {order.datum}</span>
                    <span>Totaal: €{order.totaal}</span>
                </summary>

                <div style={{ padding: '15px', borderTop: '1px solid #ddd' }}>
                    <h4 style={{ marginTop: 0 }}>Bestelde producten:</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {order.producten && order.producten.map((item, index) => (
                            <li key={index} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                padding: '8px 0',
                                borderBottom: '1px dotted #ccc'
                            }}>
                                <span>{item.quantity}x {item.brand} ({item.volume})</span>
                                <strong>€{(item.price * item.quantity).toFixed(2)}</strong>
                            </li>
                        ))}
                    </ul>
                    <div style={{ textAlign: 'right', marginTop: '10px', fontWeight: 'bold' }}>
                        Totaal betaald: €{order.totaal}
                    </div>
                </div>
            </details>
        ))
    ) : <p>Je hebt nog geen bestellingen gedaan.</p>}
</section>

            <hr style={{ margin: '40px 0' }} />

            <section>
                <h2>Wachtwoord Wijzigen</h2>
                <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
                    <input type="password" placeholder="Nieuw wachtwoord" value={passwords.new} 
                           onChange={e => setPasswords({...passwords, new: e.target.value})} required />
                    <input type="password" placeholder="Bevestig nieuw wachtwoord" value={passwords.confirm} 
                           onChange={e => setPasswords({...passwords, confirm: e.target.value})} required />
                    <button type="submit" className="btn-secondary">Wijzig Wachtwoord</button>
                    {msg && <p style={{ color: msg.includes('succesvol') ? 'green' : 'red' }}>{msg}</p>}
                </form>
            </section>

            <section style={{ marginTop: '60px', border: '1px solid red', padding: '20px', borderRadius: '8px' }}>
                <h2 style={{ color: 'red', marginTop: 0 }}>Gevarenzone</h2>
                <p>Je account wordt direct verwijderd uit ons systeem.</p>
                <button onClick={handleDeleteAccount} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}>
                    Account Permanent Verwijderen
                </button>
            </section>
        </div>
    );
};

export default MyAccount;