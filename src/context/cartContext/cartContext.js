import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('shopping-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('shopping-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity) => {
    setCart(prevCart => {
        // Zoek of het product al in het mandje zit
        const existingItem = prevCart.find(item => item.id === product.id);

        if (existingItem) {
            // Tel de aantallen bij elkaar op
            return prevCart.map(item =>
                item.id === product.id 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            );
        }
        // Voeg nieuw product toe
        return [...prevCart, { ...product, quantity }];
    });
};

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('shopping-cart');
    };

    // Optioneel: Voeg een functie toe om 1 item te verwijderen
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Voorkom dat het aantal lager dan 1 wordt
    
    setCart(prevCart => prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
};

    return (
        <CartContext.Provider value={{ cart, addToCart, cartCount, clearCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);