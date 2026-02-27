const UspSection = () => {
    const usps = [
        { icon: "🚚", title: "Snel in huis", desc: "Voor 22:00 besteld, morgen vers." },
        { icon: "🌱", title: "Duurzaam", desc: "Direct van de lokale boer." },
        { icon: "🛡️", title: "Veilig betalen", desc: "Met iDEAL, Creditcard of achteraf." }
    ];

    return (
        <section className="usp-container">
            {usps.map((usp, index) => (
                <div key={index} className="usp-card">
                    <span className="usp-icon">{usp.icon}</span>
                    <h4>{usp.title}</h4>
                    <p>{usp.desc}</p>
                </div>
            ))}
        </section>
    );
};

export default UspSection;