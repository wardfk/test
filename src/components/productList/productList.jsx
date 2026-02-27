import React, { useState, useEffect } from 'react';
import ProductCard from '../productCard/productCard';
import './productList-style.css';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductList = ({ products = [], title }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('Alle');

    // 1. Haal de zoekterm uit de URL
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('search')?.toLowerCase() || "";

    // FIX: Als de zoekterm verandert, resetten we de categorie filter
    useEffect(() => {
        if (searchTerm) {
            setSelectedCategory('Alle');
        }
    }, [searchTerm]);

    // 2. Unieke categorieën ophalen
    const categories = ['Alle', ...new Set(products.map(p => p.categorie).filter(Boolean))];

    // 3. Filter logica
    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'Alle' || p.categorie === selectedCategory;
        
        const matchesSearch = 
            p.brand?.toLowerCase().includes(searchTerm) || 
            p.categorie?.toLowerCase().includes(searchTerm) ||
            p.supplier?.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="product-list-container">
            {/* Titel wordt dynamisch aangepast */}
            <h2>{searchTerm ? `Resultaten voor "${searchTerm}"` : title}</h2>

            {/* Categorie Knoppen */}
            <div className="category-filters">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid display logic */}
            <div className="product-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="no-results">
                        <p>Geen producten gevonden voor deze selectie.</p>
                        <button 
                            className="text-link-btn"
                            onClick={() => {
                                setSelectedCategory('Alle');
                                navigate('/products'); // Gebruik navigate i.p.v. window.location
                            }}
                        >
                            Bekijk alle producten
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;