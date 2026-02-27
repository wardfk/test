import bcrypt from 'bcryptjs';

const API_URL = "http://localhost:5000/users";

export const registerUser = async (userData) => {
    // 1. Hash het wachtwoord (maak het onleesbaar)
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(userData.password, salt);

    // 2. Maak een nieuw object met het beveiligde wachtwoord
    const newUser = { 
        ...userData, 
        password: hashedPassword 
    };

    // 3. Verstuur naar db.json
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    });

    return response.json();
};