import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/cartContext/cartContext';
import RelatedProducts from './RelatedProducts'; // Vergeet deze niet te maken

const ProductDetail = ({ products }) => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [count, setCount] = useState(1);
    
    // Zoek het specifieke product op basis van de ID in de URL
    const product = products.find(p => p.id === parseInt(id));

    // Scroll naar boven als je een nieuw product opent
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return <div className="error-container">Product niet gevonden.</div>;
    }

    const handleAddToCart = () => {
        addToCart(product, count);
        // Hier kun je eventueel je toast-notificatie weer aanroepen
    };

    return (
        <div className="product-detail-page">
            <div className="breadcrumb">
                <Link to="/">Home</Link> / <Link to="/products">Producten</Link> / {product.brand}
            </div>

            <div className="product-main-container">
                {/* Linkerkant: Afbeelding */}
                <div className="product-image-section">
                    <div className="image-wrapper">
                        <span className="detail-emoji">{product.emoji || '📦'}</span>
                    </div>
                </div>

                {/* Rechterkant: Informatie */}
                <div className="product-info-section">
                    <span className="category-badge">{product.categorie}</span>
                    <h1 className="product-title">{product.brand}</h1>
                    <p className="supplier-name">Geleverd door: {product.supplier}</p>
                    
                    <div className="price-container">
                        <span className="detail-price">€{product.price.toFixed(2)}</span>
                        <span className="price-unit">per stuk</span>
                    </div>

                    <p className="product-description">
                        Geniet van de hoogste kwaliteit {product.brand.toLowerCase()}. 
                        Vers geselecteerd en met zorg verpakt om de beste smaakervaring te garanderen.
                    </p>

                    <div className="purchase-actions">
                        <div className="quantity-selector">
                            <button onClick={() => setCount(Math.max(1, count - 1))}>-</button>
                            <span className="quantity-number">{count}</span>
                            <button onClick={() => setCount(count + 1)}>+</button>
                        </div>
                        <button className="btn-add-to-cart" onClick={handleAddToCart}>
                            In winkelmandje
                        </button>
                    </div>

                    <div className="extra-info">
                        <span>🚚 Voor 22:00 besteld, morgen in huis</span>
                        <span>✅ 14 dagen bedenktijd</span>
                    </div>
                </div>
            </div>

            {/* Gerelateerde producten onderaan */}
            <RelatedProducts currentProduct={product} allProducts={products} />
        </div>
    );
};

export default ProductDetail;