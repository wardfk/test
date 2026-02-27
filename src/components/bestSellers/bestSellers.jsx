import React, { useState, useEffect } from "react";
import { getProducts } from "../../services/productService";
import ProductCard from '../productCard/productCard'; 
import './bestSellers-style.css';

const BestSellers = () => {
    const [bestSellers, setBestSellers] = useState([]);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const allProducts = await getProducts();
                // Sorteer bijvoorbeeld op voorraad (laagste eerst = meest verkocht) 
                // of pak gewoon de eerste 4 als voorbeeld
                const topProducts = allProducts
                    .sort((a, b) => a.stock - b.stock) 
                    .slice(0, 4); 
                setBestSellers(topProducts);
            } catch (error) {
                console.error("Fout bij ophalen bestsellers:", error);
            }
        };
        fetchBestSellers();
    }, []);

    return (
        <section className="bestsellers-section">
            <h2 className="section-title">Populairste Producten</h2>
            <div className="product-grid">
                {bestSellers.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default BestSellers;