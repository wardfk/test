import React, { useState } from 'react';
import toast from 'react-hot-toast'; // We gebruiken de toast die we eerder hebben geinstalleerd!

const Newsletter = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            toast.success("Bedankt! Je bent nu ingeschreven voor de nieuwsbrief.");
            setEmail("");
        } else {
            toast.error("Vul a.u.b. een geldig e-mailadres in.");
        }
    };

    return (
        <section className="newsletter-section">
            <div className="newsletter-container">
                <div className="newsletter-text">
                    <h2>Blijf op de hoogte 🍏</h2>
                    <p>Ontvang wekelijks de scherpste aanbiedingen en heerlijke recepten direct in je mailbox.</p>
                </div>
                
                <form className="newsletter-form" onSubmit={handleSubscribe}>
                    <input 
                        type="email" 
                        placeholder="Je beste e-mailadres..." 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <button type="submit" className="btn-subscribe">
                        Inschrijven
                    </button>
                </form>
                
                <p className="newsletter-footer">
                    Geen spam, beloofd. Uitschrijven kan op elk moment.
                </p>
            </div>
        </section>
    );
};

export default Newsletter;