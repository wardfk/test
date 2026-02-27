import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/cartContext/cartContext'; // Pad controleren
import toast from 'react-hot-toast';
import './productCard-style.css';

const ProductCard = ({ product }) => {
    const [count, setCount] = useState(0);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // 1. Zoek de actie-optie of de eerste beschikbare optie
    const promoOption = product.options?.find(opt => opt.isOptionPromotion) || product.options?.[0];
    
    // 2. Bepaal de definitieve prijs voor weergave en winkelwagen
    // We geven prioriteit aan de promoOption, dan product.price op hoofdniveau
    const currentPrice = promoOption ? promoOption.price : (product.price || 0);
    const oldPrice = promoOption ? promoOption.oldPrice : (product.oldPrice || null);

    const discountPercentage = (oldPrice && currentPrice < oldPrice) 
        ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) 
        : null;

    const handleAddToCart = (e) => {
        e.stopPropagation(); 
        if (count > 0) {
            // Belangrijk: we sturen 'currentPrice' mee naar de cart!
            addToCart({ ...product, price: currentPrice }, count);
            toast.success(`${count}x ${product.brand} toegevoegd!`);
            setCount(0);
        } else {
            toast.error("Kies eerst een aantal.");
        }
    };

    return (
        <div className="modern-card">
            {/* Kortingsbadge tonen als er een promoOption is */}
            {discountPercentage && (
                <div className="promo-badge-circle">
                    -{discountPercentage}%
                </div>
            )}

            <div className="card-badge-container" onClick={(e) => e.stopPropagation()}>
                <Link 
                    to={`/products?category=${encodeURIComponent(product.categorie)}`} 
                    className="card-badge"
                >
                    {product.categorie}
                </Link>
            </div>
            
            <Link to={`/product/${product.id}`} className="product-clickable-area" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="image-placeholder">
                    <span className="emoji-icon">{product.emoji || '🛒'}</span>
                </div>

                <div className="card-info">
                    <h3 className="brand-name">{product.brand}</h3>
                    <p className="product-detail">{product.supplier}</p>
                    
                    {/* Prijssectie aangepast voor promoties */}
                    <div className="price-tag-container">
                        {oldPrice && (
                            <span className="old-price" style={{ textDecoration: 'line-through', color: 'gray', marginRight: '8px' }}>
                                €{Number(oldPrice).toFixed(2)}
                            </span>
                        )}
                        <span className="price-tag" style={{ color: oldPrice ? '#e63946' : 'inherit', fontWeight: 'bold' }}>
                            €{Number(currentPrice).toFixed(2)}
                        </span>
                    </div>
                </div>
            </Link>

            <div className="card-footer" onClick={(e) => e.stopPropagation()}>
                <div className="counter-section">
                    <button onClick={() => count > 0 && setCount(count - 1)} className="btn-circle">-</button>
                    <span className="count-number">{count}</span>
                    <button onClick={() => setCount(count + 1)} className="btn-circle">+</button>
                </div>

                <div className="card-actions">
                    <button className="btn-add" onClick={handleAddToCart}>Toevoegen</button>
                    <button onClick={() => setCount(0)} className="btn-reset" title="Reset">🔄</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;