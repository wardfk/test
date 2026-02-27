import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getProducts } from './services/productService';
import Navbar from './components/navbar/navbar'; // Zorg dat dit pad klopt
import ProductList from './components/productList/productList';
import ProductPage from './pages/product/ProductPage';
import ProductsPage from './pages/products/ProductsPage';
import AuthPage from './pages/auth/AuthPage'; 
import CartPage from './pages/CartPage';
import MyAccount from './pages/MyAccount/MyAccountPage';
import AdminPage from './pages/admin/AdminPage';
import BestSellers from './components/bestSellers/bestSellers';
import { CartProvider } from './context/cartContext/cartContext';
import './App.css';
import { Toaster } from 'react-hot-toast';
import Home from './components/home/Home';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducten = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Oeps, producten laden mislukt:", error);
      }
    };
    fetchProducten();
  }, []);

  return (
    <CartProvider>
    <div className="App">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <main className="shop-container">
        <Routes>
  {/* Home route: We geven de 'products' state mee die je bovenaan in App.js al ophaalt */}
  <Route path="/" element={<Home products={products} />} />

  {/* De Products route: Deze moet nu naar ProductsPage wijzen */}
  <Route path="/products" element={<ProductsPage />} />

  <Route path="/contact" element={<div style={{padding: '50px'}}>Contacteer ons via support@supermarkt.nl</div>} />
  <Route path="/login" element={<AuthPage />} />
  <Route path="/product/:id" element={<ProductPage />} />
  
  <Route path="/account" element={<MyAccount />} />
  <Route path="/winkelmand" element={<CartPage />} />
  <Route path="/admin" element={<AdminPage products={products} setProducts={setProducts} />} />
</Routes>
      </main>
    </div>
    </CartProvider>
  );
}

export default App;