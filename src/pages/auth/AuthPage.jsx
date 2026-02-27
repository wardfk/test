import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AuthPage-style.css';
import bcrypt from 'bcryptjs';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Onthoud waar de gebruiker vandaan kwam
  const from = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    wachtwoord: '',
    wachtwoordBevestig: ''
  });


const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        if (isLogin) {
            // --- INLOGGEN ---
            const response = await axios.get(`http://localhost:5000/users?email=${formData.email}`);
            const user = response.data[0];

            // AANPASSING HIER: Gebruik bcrypt.compareSync in plaats van ===
            if (user && bcrypt.compareSync(formData.wachtwoord, user.wachtwoord)) {
                localStorage.setItem('user', JSON.stringify(user));
                alert(`Welkom terug, ${user.naam}!`);
                navigate(from, { replace: true });
            } else {
                alert("Onjuist e-mailadres of wachtwoord.");
            }
        } else {
            // --- REGISTREREN ---
            if (formData.wachtwoord !== formData.wachtwoordBevestig) {
                alert("De wachtwoorden komen niet overeen!");
                return;
            }

            const checkUser = await axios.get(`http://localhost:5000/users?email=${formData.email}`);
            if (checkUser.data.length > 0) {
                alert("Dit e-mailadres is al in gebruik.");
                return;
            }

            // AANPASSING HIER: Hash het wachtwoord voordat je het verstuurt
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(formData.wachtwoord, salt);

            const dataToSubmit = {
                naam: formData.naam,
                email: formData.email,
                wachtwoord: hashedPassword // Sla de hash op, niet de tekst!
            };

            await axios.post('http://localhost:5000/users', dataToSubmit);
            
            alert("Account aangemaakt! Je kunt nu inloggen.");
            setIsLogin(true);
        }
    } catch (error) {
        console.error("Fout tijdens proces:", error);
        alert("Er is een verbindingsfout opgetreden.");
    }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-toggle">
          <button 
            type="button"
            className={isLogin ? "active" : ""} 
            onClick={() => setIsLogin(true)}
          >
            Inloggen
          </button>
          <button 
            type="button"
            className={!isLogin ? "active" : ""} 
            onClick={() => setIsLogin(false)}
          >
            Registreren
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{isLogin ? "Welkom terug!" : "Maak een account"}</h2>
          
          {!isLogin && (
            <div className="form-group">
              <label>Naam</label>
              <input 
                type="text" 
                value={formData.naam} 
                onChange={(e) => setFormData({ ...formData, naam: e.target.value })} 
                placeholder="Je volledige naam" 
                required 
              />
            </div>
          )}

          <div className="form-group">
            <label>E-mailadres</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              placeholder="naam@voorbeeld.nl" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Wachtwoord</label>
            <input 
              type="password" 
              value={formData.wachtwoord}
              onChange={(e) => setFormData({ ...formData, wachtwoord: e.target.value })} 
              placeholder="••••••••" 
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Bevestig Wachtwoord</label>
              <input 
                type="password" 
                value={formData.wachtwoordBevestig}
                onChange={(e) => setFormData({ ...formData, wachtwoordBevestig: e.target.value })} 
                placeholder="••••••••" 
                required
              />
            </div>
          )}

          <button type="submit" className="auth-submit">
            {isLogin ? "Inloggen" : "Account aanmaken"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;