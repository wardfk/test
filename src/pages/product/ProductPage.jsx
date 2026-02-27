import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/cartContext/cartContext';
import './productPage-style.css'; // Vergeet deze import niet!
import RelatedProducts from '../../components/relatedProducts/RelatedProducts';

const ProductPage = () => {
    const { id } = useParams();
    
    // States
    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchPageData = async () => {
            setLoading(true);
            try {
                // 1. Haal het specifieke product op
                const productRes = await axios.get(`http://localhost:5000/products/${id}`);
                setProduct(productRes.data);
                
                // Zet de standaard geselecteerde optie (bijv. de eerste maat/volume)
                if (productRes.data.options && productRes.data.options.length > 0) {
                    setSelectedOption(productRes.data.options[0]);
                }

                // 2. Haal alle producten op voor de 'RelatedProducts' component
                const allRes = await axios.get(`http://localhost:5000/products`);
                setAllProducts(allRes.data);
                
            } catch (err) {
                console.error("Er is een fout opgetreden bij het laden van de pagina:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
        
        // Scroll naar boven als je naar een nieuw product navigeert
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        if (!product || !selectedOption) return;
        
        const productToAdd = {
            ...product,
            // We maken een unieke ID voor het mandje op basis van product + gekozen optie
            id: `${product.id}-${selectedOption.size}`,
            price: selectedOption.price,
            volume: selectedOption.size
        };
        
        addToCart(productToAdd, quantity);
        // Tip: Je kunt de 'alert' eventueel vervangen door een mooie toast-melding later
        alert(`${product.brand} (${selectedOption.size}) is toegevoegd aan je mandje!`);
    };

    if (loading) return <div className="loader">Product laden...</div>;
    if (!product || !selectedOption) return <div className="error">Product niet gevonden.</div>;

    return (
        <div className="product-page-container">
            {/* BOVENSTE SECTIE: Afbeelding en Bestelopties */}
            <div className="product-main-section">
                <div className="product-image-box">
                    <span className="product-emoji">{product.emoji || '🌿'}</span>
                </div>

                <div className="product-info-box">
                    <h1 className="product-brand">{product.brand}</h1>
                    <p className="product-category">Categorie: {product.categorie}</p>
                    
                    <h2 className="product-price">
                        €{(selectedOption.price * quantity).toFixed(2)}
                    </h2>

                    <div className="selection-wrapper">
                        <label htmlFor="size-select">Kies een uitvoering:</label>
                        <select 
                            id="size-select"
                            className="product-select"
                            onChange={(e) => setSelectedOption(product.options[e.target.value])}
                        >
                            {product.options.map((opt, index) => (
                                <option key={index} value={index}>
                                    {opt.size} (€{opt.price.toFixed(2)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="purchase-controls">
                        <input 
                            className="quantity-input"
                            type="number" 
                            min="1"
                            value={quantity} 
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button className="add-to-cart-btn" onClick={handleAddToCart}>
                            In winkelwagen
                        </button>
                    </div>
                </div>
            </div>

            {/* MIDDELSTE SECTIE: Blauwe box met extra details */}
            <div className="product-details-box">
                <h3 className="details-title">Productinformatie</h3>
                
                <div className="description-section">
                    <strong>Beschrijving:</strong>
                    <p className="description-text">
                        {product.description || "Er is voor dit product helaas nog geen uitgebreide beschrijving beschikbaar."}
                    </p>
                </div>

                <div className="product-meta-info">
                    {product.sku && (
                        <span className="meta-item">
                            <strong>SKU:</strong> {product.sku}
                        </span>
                    )}
                    <span className="meta-item">
                        <strong>Leverancier:</strong> {product.supplier || "Onbekend"}
                    </span>
                </div>
            </div>

            {/* ONDERSTE SECTIE: Gerelateerde producten */}
            <div className="related-wrapper">
                <RelatedProducts 
                    currentProduct={product} 
                    allProducts={allProducts} 
                />
            </div>
        </div>
    );
};

export default ProductPage;