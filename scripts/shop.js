// Product Data
const products = [
    {
        id: 1,
        name: "Crema Viso Idratante",
        price: 24.90,
        category: "cosmesi",
        image: "assets/images/logo-rot.png", // Placeholder, ideally replace with real product images
        description: "Idratazione profonda per pelli sensibili."
    },
    {
        id: 2,
        name: "Magnesio Supremo",
        price: 18.50,
        category: "integratori",
        image: "assets/images/logo-rot.png",
        description: "Ideale per stanchezza e affaticamento."
    },
    {
        id: 3,
        name: "Detergente Delicato",
        price: 9.90,
        category: "igiene",
        image: "assets/images/logo-rot.png",
        description: "Per l'igiene quotidiana di tutta la famiglia."
    },
    {
        id: 4,
        name: "Vitamina C 1000mg",
        price: 12.00,
        oldPrice: 15.00,
        category: "offerte",
        image: "assets/images/logo-rot.png",
        description: "Supporto per le difese immunitarie."
    },
    {
        id: 5,
        name: "Siero Anti-Age",
        price: 35.00,
        oldPrice: 45.00,
        category: "offerte", // Multi-category logic can be added later
        image: "assets/images/logo-rot.png",
        description: "Siero concentrato rimpolpante."
    },
    {
        id: 6,
        name: "Probiotici Plus",
        price: 15.50,
        category: "integratori",
        image: "assets/images/logo-rot.png",
        description: "Equilibrio della flora intestinale."
    }
];

// DOM Elements
const grid = document.getElementById('products-grid');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupFilters();
});

// Render Products Function
function renderProducts(items) {
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p class="no-products">Nessun prodotto trovato in questa categoria.</p>';
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // WhatsApp Message Encoding
        const message = `Salve, vorrei prenotare il prodotto: ${product.name} (Prezzo: €${product.price.toFixed(2)})`;
        const waLink = `https://wa.me/393282032288?text=${encodeURIComponent(message)}`;

        // Price Display Logic (Handle Offers)
        let priceHtml = `<div class="product-price">€${product.price.toFixed(2)}</div>`;
        if (product.oldPrice) {
            priceHtml = `
                <div class="product-price">
                    <span class="old-price">€${product.oldPrice.toFixed(2)}</span>
                    <span class="new-price">€${product.price.toFixed(2)}</span>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.oldPrice ? '<span class="badge-offer">Offerta</span>' : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category.toUpperCase()}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                ${priceHtml}
                <a href="${waLink}" target="_blank" class="btn-whatsapp">
                    <img src="assets/images/whatsapp-24.png" alt="WA" style="width:20px; vertical-align:middle; margin-right:5px;">
                    Prenota su WhatsApp
                </a>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Filter Logic
function setupFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            if (category === 'all') {
                renderProducts(products);
            } else if (category === 'offerte') {
                // Special case for offers (checks if oldPrice exists)
                const filtered = products.filter(p => p.oldPrice || p.category === 'offerte');
                renderProducts(filtered);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });
}
