import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './admin-style.css';

const AdminPage = ({ products, setProducts }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [tempData, setTempData] = useState({});

    const filteredProducts = products.filter(product => {
        const search = searchTerm.toLowerCase();
        return (
            product.brand?.toLowerCase().includes(search) ||
            product.categorie?.toLowerCase().includes(search) ||
            product.sku?.toLowerCase().includes(search)
        );
    });

    const handleChange = (productId, field, value) => {
        setTempData(prev => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value }
        }));
    };

    // FUNCTIE 1: Alleen wijzigingen opslaan (Naam, SKU, Beschrijving, Prijzen)
    const saveChanges = async (product) => {
        const input = tempData[product.id] || {};
        const updatedProduct = buildUpdatedObject(product, input, product.isPromotion || product.options?.[0]?.isOptionPromotion);

        await sendToDatabase(updatedProduct);
    };

    // FUNCTIE 2: Promotie aan- of uitzetten (en direct opslaan)
    const togglePromotion = async (product) => {
        const input = tempData[product.id] || {};
        const currentActive = product.isPromotion || product.options?.[0]?.isOptionPromotion;
        const nextStatus = !currentActive;

        // Prijsvalidatie bij aanzetten van promo
        const basis = product.options?.[0]?.oldPrice || product.options?.[0]?.price || product.price;
        const nieuweNormaal = input.regularPrice ? parseFloat(input.regularPrice) : basis;
        const nieuwePromo = input.promoPrice ? parseFloat(input.promoPrice) : (product.options?.[0]?.price || product.price);

        if (nextStatus && nieuwePromo >= nieuweNormaal) {
            toast.error("Promo prijs moet lager zijn dan de normale prijs!");
            return;
        }

        const updatedProduct = buildUpdatedObject(product, input, nextStatus);
        await sendToDatabase(updatedProduct);
    };

    // Helper om het object te bouwen (voorkomt dubbele code)
    const buildUpdatedObject = (product, input, promoStatus) => {
        const basis = product.options?.[0]?.oldPrice || product.options?.[0]?.price || product.price;
        const finaleNormaal = input.regularPrice ? parseFloat(input.regularPrice) : basis;
        const finalePromo = input.promoPrice ? parseFloat(input.promoPrice) : (product.options?.[0]?.price || product.price);

        let obj = {
            ...product,
            brand: input.brand || product.brand,
            sku: input.sku || product.sku,
            description: input.description || product.description,
            isPromotion: promoStatus
        };

        if (product.options?.length > 0) {
            obj.options = product.options.map((opt, i) => i === 0 ? {
                ...opt,
                price: promoStatus ? finalePromo : finaleNormaal,
                oldPrice: promoStatus ? finaleNormaal : null,
                isOptionPromotion: promoStatus
            } : opt);
        } else {
            obj.price = promoStatus ? finalePromo : finaleNormaal;
            obj.oldPrice = promoStatus ? finaleNormaal : null;
        }
        return obj;
    };

    const sendToDatabase = async (updatedProduct) => {
        try {
            const response = await fetch(`http://localhost:5000/products/${updatedProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });
            if (response.ok) {
                setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                toast.success("Opgeslagen!");
            }
        } catch (e) { toast.error("Fout bij opslaan"); }
    };

    return (
        <div className="admin-container">
            <h1>Product Beheer</h1>
            <input 
                type="text" 
                className="admin-search-input" 
                placeholder="Live zoeken..." 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Product & SKU</th>
                        <th>Beschrijving</th>
                        <th>Prijzen (Normaal / Promo)</th>
                        <th>Acties</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(product => {
                        const isActive = product.isPromotion || product.options?.[0]?.isOptionPromotion;
                        const basis = product.options?.[0]?.oldPrice || product.options?.[0]?.price || product.price;
                        const huidige = product.options?.[0]?.price || product.price;

                        return (
                            <tr key={product.id}>
                                <td>
                                    <input className="edit-input" defaultValue={product.brand} onChange={(e) => handleChange(product.id, 'brand', e.target.value)} />
                                    <input className="edit-input sku-input" defaultValue={product.sku} onChange={(e) => handleChange(product.id, 'sku', e.target.value)} />
                                </td>
                                <td>
                                    <textarea className="edit-textarea" defaultValue={product.description} onChange={(e) => handleChange(product.id, 'description', e.target.value)} />
                                </td>
                                <td>
                                    <div className="price-inputs">
                                        <input type="number" placeholder={`Normaal: ${basis}`} onChange={(e) => handleChange(product.id, 'regularPrice', e.target.value)} />
                                        <input type="number" placeholder={`Promo: ${huidige}`} onChange={(e) => handleChange(product.id, 'promoPrice', e.target.value)} />
                                    </div>
                                </td>
                                <td className="action-buttons">
                                    <button className="btn-save" onClick={() => saveChanges(product)}>Opslaan</button>
                                    <button className={isActive ? "btn-stop" : "btn-start"} onClick={() => togglePromotion(product)}>
                                        {isActive ? "Stop Promo" : "Maak Promo"}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;