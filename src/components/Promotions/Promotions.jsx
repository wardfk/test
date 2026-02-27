import React from 'react';
import ProductCard from '../productCard/productCard';
import './promotions-style.css';

const Promotions = ({ products = [] }) => {
    // We filteren producten die:
    // 1. Ofwel op hoofdniveau 'isPromotion: true' hebben
    // 2. Ofwel in hun 'options' array een item hebben met 'isOptionPromotion: true'
    const promoProducts = products
        .filter(product => {
            const hasMainPromotion = product.isPromotion === true;
            const hasOptionPromotion = product.options?.some(opt => opt.isOptionPromotion === true);
            
            return hasMainPromotion || hasOptionPromotion;
        })
        .slice(0, 4);

    // Als er geen promoties zijn, tonen we niets (of een melding)
    if (promoProducts.length === 0) return null;

    return (
        <section className="promotions-container">
            <div className="promotions-header">
                <span className="badge">Hot Deals</span>
                <h2>Onze Beste Aanbiedingen</h2>
                <p>Profiteer direct van deze scherpe prijzen, zolang de voorraad strekt!</p>
            </div>

            <div className="promotions-grid">
                {promoProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default Promotions;