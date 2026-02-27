import React from 'react';
import ProductCard from '../productCard/productCard';

const RelatedProducts = ({ currentProduct, allProducts }) => {
    // Filteren: zelfde categorie, niet het huidige product
    const related = allProducts
        .filter(p => p.categorie === currentProduct.categorie && p.id !== currentProduct.id)
        .slice(0, 5);

    if (related.length === 0) return null;

    return (
        <section className="related-products-section">
            <h2 className="section-title">Anderen bekeken ook</h2>
            <div className="product-grid">
                {related.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts;