import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { useCart } from '../../context/cartContext/cartContext';
import './navbar-style.css';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount } = useCart(); 

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        navigate(`/products?search=${encodeURIComponent(value)}`);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getProducts();
                const uniqueCategories = [...new Set(data.map(p => p.categorie))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Kon categorieën niet laden", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchTerm(params.get('search') || "");
        const loggedInUser = localStorage.getItem('user');
        setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/'); // Terug naar home na uitloggen
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* 1. LOGO (Dit is je Home-button) */}
                <Link to="/" className="navbar-logo">
                    Super<span className="accent">Markt</span>
                </Link>

                <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    <span className={menuOpen ? "bar open" : "bar"}></span>
                    <span className={menuOpen ? "bar open" : "bar"}></span>
                    <span className={menuOpen ? "bar open" : "bar"}></span>
                </div>

                <div className={`navbar-content ${menuOpen ? "active" : ""}`}>
                    
                    {/* 2. ZOEKBALK (Focus van de shop) */}

                    <div className="navbar-links">
                        <div className="navbar-search">
                            <input 
                                type="text" 
                                placeholder="Zoek in assortiment..." 
                                className="search-input"
                                value={searchTerm}
                                onChange={handleSearch} 
                            />
                        </div>
                        {/* 3. CATEGORIEËN DROPDOWN */}
                        <div className="nav-item dropdown">
                            <Link to="/products" className="nav-link-main">Producten ▾</Link>
                            <ul className="dropdown-menu">
                                {categories.map(cat => (
                                    <li key={cat}>
                                        <Link to={`/products?category=${encodeURIComponent(cat)}`}>{cat}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 4. USER / ACCOUNT */}
                        {user ? (
                            <div className="nav-item user-dropdown-container">
                                <Link to="/account" className="nav-icon-link">
                                    <span className="nav-icon">👤</span>
                                    <span className="nav-text">Mijn Account</span>
                                </Link>
                                <button onClick={handleLogout} className="logout-link">Uitloggen</button>
                            </div>
                        ) : (
                            <Link to="/login" className="nav-item login-link">Inloggen</Link>
                        )}

                        {/* 5. WINKELMAND (Altijd uiterst rechts) */}
                        <Link to="/winkelmand" className="nav-item cart-link">
                            <span className="nav-icon">🛒</span>
                            <span className="nav-text">Mandje</span>
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;