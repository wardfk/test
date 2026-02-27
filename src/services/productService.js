import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:5000'
});

export const getProducts = async () => {
    try{
        const response = await api.get('/products');
        // Axios zet de JSON automatisch om, de data zit altijd in .data
        return response.data;
    } catch (error) {
        console.error("Fout bij het ophalen van producten met Axios:", error);
        throw error;
    }
};