// Массив из 15 объектов товаров
const products = [
    {
        id: 1,
        name: "Boat Rockerz 333",
        category: "headphones",
        price: 20,
        image: "../images/rockerz.png",
        reviews: 75,
        description: "Premium wireless headphones with deep bass and crystal clear sound",
        stock: "In Stock",
        badge: "Hot",
        backgroundColor: "bg-green"
    },
    {
        id: 2,
        name: "Boat Kerz 234",
        category: "earbuds",
        price: 40,
        image: "../images/kerz.png",
        reviews: 75,
        description: "Compact earbuds with noise cancellation technology",
        stock: "In Stock",
        badge: "New",
        backgroundColor: "bg-blue"
    },
    {
        id: 3,
        name: "Boat Rockerz 323",
        category: "headphones",
        price: 30,
        image: "../images/roc.png",
        reviews: 75,
        description: "Comfortable over-ear headphones for extended listening",
        stock: "In Stock",
        badge: "",
        backgroundColor: "bg-purple"
    },
    {
        id: 4,
        name: "Boat Rockerz 555",
        category: "wireless",
        price: 20,
        image: "../images/rockerz1.png",
        reviews: 82,
        description: "Wireless freedom with superior sound quality",
        stock: "In Stock",
        badge: "Hot",
        backgroundColor: "bg-lightblue"
    },
    {
        id: 5,
        name: "Boat Kerz 456",
        category: "wireless",
        price: 40,
        image: "../images/kerz1.png",
        reviews: 68,
        description: "Sleek design with powerful audio performance",
        stock: "Low Stock",
        badge: "",
        backgroundColor: "bg-cyan"
    },
    {
        id: 6,
        name: "Boat Rockerz 789",
        category: "headphones",
        price: 30,
        image: "../images/roc1.png",
        reviews: 91,
        description: "Professional grade headphones for audiophiles",
        stock: "In Stock",
        badge: "New",
        backgroundColor: "bg-teal"
    },
    {
        id: 7,
        name: "Apple AirPods Pro",
        category: "earbuds",
        price: 45.99,
        image: "../images/apple1.png",
        reviews: 120,
        description: "Premium wireless earbuds with active noise cancellation",
        stock: "In Stock",
        badge: "Hot",
        backgroundColor: "bg-pink"
    },
    {
        id: 8,
        name: "Apple AirPods Max",
        category: "headphones",
        price: 45.99,
        image: "../images/apple2.png",
        reviews: 95,
        description: "Over-ear headphones with spatial audio",
        stock: "In Stock",
        badge: "",
        backgroundColor: "bg-yellow"
    },
    {
        id: 9,
        name: "Apple AirPods Gen 3",
        category: "wireless",
        price: 45.99,
        image: "../images/apple3.png",
        reviews: 110,
        description: "Latest generation wireless earbuds with enhanced features",
        stock: "Low Stock",
        badge: "New",
        backgroundColor: "bg-green"
    },
    {
        id: 10,
        name: "Airdrop 500 ANC",
        category: "earbuds",
        price: 45.99,
        image: "../images/img1air.png",
        reviews: 88,
        description: "Active noise cancellation with long battery life",
        stock: "In Stock",
        badge: "",
        backgroundColor: "bg-blue"
    },
    {
        id: 11,
        name: "Airdrop Sport Edition",
        category: "wireless",
        price: 35,
        image: "../images/img2air.png",
        reviews: 76,
        description: "Water-resistant design perfect for workouts",
        stock: "In Stock",
        badge: "Hot",
        backgroundColor: "bg-purple"
    },
    {
        id: 12,
        name: "Red Beats M19C22",
        category: "headphones",
        price: 50,
        image: "../images/product.png",
        reviews: 150,
        description: "Iconic design with powerful bass and premium sound",
        stock: "In Stock",
        badge: "Hot",
        backgroundColor: "bg-lightblue"
    },
    {
        id: 13,
        name: "Boat Bassheads 225",
        category: "earbuds",
        price: 15,
        image: "../images/rockerz.png",
        reviews: 62,
        description: "Budget-friendly earbuds with impressive bass",
        stock: "In Stock",
        badge: "",
        backgroundColor: "bg-cyan"
    },
    {
        id: 14,
        name: "Boat Airdopes 441",
        category: "wireless",
        price: 28,
        image: "../images/kerz.png",
        reviews: 79,
        description: "True wireless earbuds with voice assistant support",
        stock: "Low Stock",
        badge: "New",
        backgroundColor: "bg-teal"
    },
    {
        id: 15,
        name: "Boat Immortal 1000D",
        category: "headphones",
        price: 55,
        image: "../images/roc.png",
        reviews: 103,
        description: "Gaming headphones with immersive 7.1 surround sound",
        stock: "In Stock",
        badge: "",
        backgroundColor: "bg-pink"
    }
];

// Функция для генерации карточек товаров
function generateProductCards(productsArray) {
    const container = document.getElementById('catalog-container');
    container.innerHTML = ''; // Очистка контейнера

    productsArray.forEach(product => {
        // Создание карточки товара
        const card = document.createElement('div');
        card.className = 'product-catalog-card';

        // Определение класса статуса товара
        let stockClass = '';
        if (product.stock === "In Stock") {
            stockClass = 'in-stock';
        } else if (product.stock === "Low Stock") {
            stockClass = 'low-stock';
        } else {
            stockClass = 'out-of-stock';
        }

        // Формирование HTML карточки
        card.innerHTML = `
            <div class="product-catalog-card-image ${product.backgroundColor}">
                ${product.badge ? `<div class="product-badge ${product.badge.toLowerCase()}">${product.badge}</div>` : ''}
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-catalog-card-info">
                <span class="product-catalog-card-category">${product.category}</span>
                <h3 class="product-catalog-card-title">${product.name}</h3>
                <p class="product-catalog-card-description">${product.description}</p>
                <div class="product-catalog-card-reviews">
                    <img src="../images/stars.png" alt="rating">
                    <span>${product.reviews} Reviews</span>
                </div>
                <div class="product-catalog-card-bottom">
                    <span class="product-catalog-card-price">$${product.price}</span>
                    <span class="product-catalog-card-stock ${stockClass}">${product.stock}</span>
                </div>
            </div>
            <button class="product-catalog-card-button" ${product.stock === "Out of Stock" ? "disabled" : ""}>
                ${product.stock === "Out of Stock" ? "Out of Stock" : "Add to Cart"}
            </button>
        `;

        container.appendChild(card);
    });
}

// Функция фильтрации товаров
function filterProducts(category) {
    if (category === 'all') {
        generateProductCards(products);
    } else {
        const filtered = products.filter(product => product.category === category);
        generateProductCards(filtered);
    }
}

// Функция для обновления информации о примененном методе
function updateMethodInfo(methodName, description, resultCount) {
    const infoElement = document.getElementById('method-info');
    infoElement.innerHTML = `
        <strong>Method:</strong> <code>${methodName}</code><br>
        <strong>Description:</strong> ${description}<br>
        <strong>Results:</strong> ${resultCount} product(s) displayed
    `;
}

// Функции для применения различных методов массивов
const arrayMethods = {
    // 1. sort() - Сортировка по цене (возрастание)
    'price-asc': () => {
        const sorted = [...products].sort((a, b) => a.price - b.price);
        generateProductCards(sorted);
        updateMethodInfo(
            'sort((a, b) => a.price - b.price)',
            'Sorts products by price in ascending order (lowest to highest)',
            sorted.length
        );
    },

    // 2. sort() - Сортировка по цене (убывание)
    'price-desc': () => {
        const sorted = [...products].sort((a, b) => b.price - a.price);
        generateProductCards(sorted);
        updateMethodInfo(
            'sort((a, b) => b.price - a.price)',
            'Sorts products by price in descending order (highest to lowest)',
            sorted.length
        );
    },

    // 3. sort() - Сортировка по количеству отзывов (убывание)
    'reviews-desc': () => {
        const sorted = [...products].sort((a, b) => b.reviews - a.reviews);
        generateProductCards(sorted);
        updateMethodInfo(
            'sort((a, b) => b.reviews - a.reviews)',
            'Sorts products by review count in descending order (most reviewed first)',
            sorted.length
        );
    },

    // 4. filter() - Товары дешевле $30
    'cheap': () => {
        const filtered = products.filter(product => product.price < 30);
        generateProductCards(filtered);
        updateMethodInfo(
            'filter(product => product.price < 30)',
            'Filters products with price less than $30',
            filtered.length
        );
    },

    // 5. filter() - Товары дороже $40
    'expensive': () => {
        const filtered = products.filter(product => product.price > 40);
        generateProductCards(filtered);
        updateMethodInfo(
            'filter(product => product.price > 40)',
            'Filters products with price greater than $40',
            filtered.length
        );
    },

    // 6. filter() - Товары с бейджем "Hot"
    'hot': () => {
        const filtered = products.filter(product => product.badge === "Hot");
        generateProductCards(filtered);
        updateMethodInfo(
            'filter(product => product.badge === "Hot")',
            'Filters products with "Hot" badge - special deals and popular items',
            filtered.length
        );
    },

    // 7. filter() - Товары с бейджем "New"
    'new': () => {
        const filtered = products.filter(product => product.badge === "New");
        generateProductCards(filtered);
        updateMethodInfo(
            'filter(product => product.badge === "New")',
            'Filters products with "New" badge - newest arrivals',
            filtered.length
        );
    },

    // 8. map() - Применение скидки 10% ко всем товарам
    'discount': () => {
        const discounted = products.map(product => ({
            ...product,
            price: parseFloat((product.price * 0.9).toFixed(2)),
            badge: "Sale"
        }));
        generateProductCards(discounted);
        updateMethodInfo(
            'map(product => ({...product, price: product.price * 0.9}))',
            'Applies 10% discount to all products using map() to transform the array',
            discounted.length
        );
    },

    // 9. reverse() - Обратный порядок товаров
    'reverse': () => {
        const reversed = [...products].reverse();
        generateProductCards(reversed);
        updateMethodInfo(
            'reverse()',
            'Reverses the order of products in the array',
            reversed.length
        );
    },

    // 10. slice() - Первые 5 товаров
    'top5': () => {
        const topProducts = products.slice(0, 5);
        generateProductCards(topProducts);
        updateMethodInfo(
            'slice(0, 5)',
            'Returns only the first 5 products from the array',
            topProducts.length
        );
    }
};

// Функция для применения метода массива
function applyArrayMethod(method) {
    if (arrayMethods[method]) {
        arrayMethods[method]();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Генерация всех карточек товаров
    generateProductCards(products);

    // Обработка кликов на кнопки фильтров категорий
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаление активного класса у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавление активного класса на нажатую кнопку
            button.classList.add('active');
            // Фильтрация товаров
            const category = button.getAttribute('data-category');
            filterProducts(category);
            // Сброс информации о методе
            document.getElementById('method-info').textContent = 'Select a method to see the results';
        });
    });

    // Обработка кликов на кнопки методов массивов
    const methodButtons = document.querySelectorAll('.method-btn');
    methodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const method = button.getAttribute('data-method');
            applyArrayMethod(method);
            
            // Добавление визуального эффекта активной кнопки
            methodButtons.forEach(btn => btn.style.borderColor = '#e0e0e0');
            button.style.borderColor = '#10B981';
            
            // Сброс активного фильтра категории
            filterButtons.forEach(btn => btn.classList.remove('active'));
        });
    });

    // Обработка клика на кнопку сброса
    const resetButton = document.getElementById('reset-catalog');
    resetButton.addEventListener('click', () => {
        // Восстановление исходного каталога
        generateProductCards(products);
        
        // Сброс активного состояния всех кнопок методов
        methodButtons.forEach(btn => btn.style.borderColor = '#e0e0e0');
        
        // Восстановление активного состояния фильтра "All Products"
        filterButtons.forEach(btn => btn.classList.remove('active'));
        filterButtons[0].classList.add('active');
        
        // Сброс информации о методе
        document.getElementById('method-info').textContent = 'Select a method to see the results';
    });

    // Обработка кликов на кнопки "Add to Cart"
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('product-catalog-card-button') && !e.target.disabled) {
            alert('Product added to cart!');
        }
    });
});

