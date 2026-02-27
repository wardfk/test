import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../../components/productList/productList'; 

const ProductsPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        console.log("Poging tot verbinden met database op poort 5000...");
        
        axios.get('http://localhost:5000/products')
            .then(res => {
                console.log("Verbinding geslaagd! Data:", res.data);
                setProducts(res.data);
            })
            .catch(err => {
                console.error("Kan database niet bereiken. Controleer je terminal!", err);
            });
    }, []);

    return (
        <div className="container">
            <ProductList products={products} />
        </div>
    );
};

export default ProductsPage;