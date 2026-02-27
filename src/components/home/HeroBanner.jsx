import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => (
    <section className="hero-banner">
        <div className="hero-content">
            <h1>Echt vers, echt lokaal.</h1>
            <p>De beste producten van het seizoen, vandaag geoogst, morgen in huis.</p>
            <Link to="/products" className="btn-primary">Ontdek Assortiment</Link>
        </div>
    </section>
);

export default HeroBanner;