import React, { useState, useEffect } from 'react';
import HeroBanner from './HeroBanner';
import UspSection from './UspSection';
import ProductList from '../productList/productList';
import Newsletter from './Newsletter';
import './home-style.css';
import { Link } from 'react-router-dom';
import Promotions from '../Promotions/Promotions';

const Home = ({ products = [] }) => { // Default naar lege array
    const [displayCount, setDisplayCount] = useState(6);

    useEffect(() => {
        const updateCount = () => {
            const width = window.innerWidth;
            if (width < 600) setDisplayCount(4);
            else if (width < 1024) setDisplayCount(6);
            else if (width < 1400) setDisplayCount(8);
            else setDisplayCount(10);
        };

        updateCount();
        window.addEventListener('resize', updateCount);
        return () => window.removeEventListener('resize', updateCount);
    }, []);

    // Veiligheidsslag: als er geen producten zijn, toon een lader
    if (!products || products.length === 0) return <div className="loading">Producten laden...</div>;

    const featuredProducts = products.slice(0, displayCount);

    return (
        <div className="home-wrapper">
            <HeroBanner />
            <div className="content-container">
                <section className="featured-section">
                    <h2>Populaire Producten</h2>
                    {/* Belangrijk: ProductList is hier een onderdeel van Home */}
                    <ProductList products={featuredProducts} title="" />
                    
                    <div className="center-btn">
                        <Link to="/products" className="btn-outline">Bekijk alle producten</Link>
                    </div>
                </section>
                <UspSection />
                <Promotions products={products} />
                <Newsletter />
            </div>
        </div>
    );
};
export default Home;