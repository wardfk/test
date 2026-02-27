import React from 'react';
import { useCart } from '../context/cartContext/cartContext'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cart, cartCount, clearCart, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // FIX: Beveilig de berekening tegen 'undefined' prijzen
    const totaalPrijs = cart.reduce((acc, item) => {
        const price = item.price || 0;
        return acc + (price * item.quantity);
    }, 0);

    const handleCheckout = async () => {
        if (!user) {
            alert("Log eerst in om te bestellen!");
            navigate('/login');
            return;
        }

        const order = {
            userId: user.id,
            userEmail: user.email,
            datum: new Date().toLocaleString(),
            producten: cart,
            totaal: totaalPrijs.toFixed(2),
            status: "In behandeling"
        };

        try {
            await axios.post('http://localhost:5000/users-orders', order);
            clearCart();
            alert("Bedankt voor je botanische bestelling!");
            navigate('/account'); // Navigeer direct naar account om de bestelling te zien
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Er ging iets mis bij het plaatsen van de bestelling.");
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#2c3e50', borderBottom: '2px solid #26ad79', paddingBottom: '10px' }}>
                Jouw Botanische Mandje ({cartCount})
            </h1>
            
            {cart.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>Je mandje is momenteel nog leeg.</p>
                    <button 
                        onClick={() => navigate('/products')}
                        style={{ backgroundColor: '#26ad79', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
                    >
                        Terug naar de winkel
                    </button>
                </div>
            ) : (
                <div style={{ marginTop: '30px' }}>
                    {cart.map(item => (
                        <div key={item.id} style={{ borderBottom: '1px solid #ddd', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0' }}>{item.brand} ({item.volume || 'Standaard'})</h3>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                                    <button 
                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        style={{ width: '25px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '3px' }}
                                    >-</button>
                                    
                                    <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                    
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        style={{ width: '25px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '3px' }}
                                    >+</button>
                                    
                                    {/* FIX: Gebruik (item.price || 0) om crashes te voorkomen */}
                                    <span style={{ marginLeft: '10px', color: '#7f8c8d' }}>x €{(item.price || 0).toFixed(2)}</span>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                {/* FIX: Ook hier de berekening beveiligen */}
                                <p><strong>€{((item.price || 0) * item.quantity).toFixed(2)}</strong></p>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    Verwijder
                                </button>
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: '30px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0 }}>Totaaloverzicht</h2>
                            <h2 style={{ margin: 0, color: '#26ad79' }}>€{totaalPrijs.toFixed(2)}</h2>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
                            <button 
                                onClick={clearCart}
                                style={{ backgroundColor: 'transparent', color: '#7f8c8d', border: '1px solid #bdc3c7', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Mandje legen
                            </button>
                            <button 
                                onClick={handleCheckout}
                                style={{ backgroundColor: '#26ad79', color: 'white', padding: '12px 30px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                            >
                                Bestelling Plaatsen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;