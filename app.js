let products = [];

let cart = JSON.parse(localStorage.getItem("bagCart")) || [];

let wishlist = JSON.parse(localStorage.getItem("bagWishlist")) || [];

const content = document.getElementById("content");

// Load products from JSON
fetch("products.json")
.then(response => {
    if (!response.ok) {
        throw new Error("Products file not found");
    }

    return response.json();
})
.then(data => {
    products = data;
    updateCounts();
    showPage();
})
.catch(error => {
    content.innerHTML = "<h2>Products could not be loaded!</h2>";
    console.log(error);
});

// Navigation
window.addEventListener("hashchange", showPage);

function showPage() {

    let page = location.hash.replace("#", "");

    if (page === "shop") {
        showProducts("All");
    }
    else if (page === "backpacks") {
        showProducts("Backpacks");
    }
    else if (page === "laptop") {
        showProducts("Laptop Bags");
    }
    else if (page === "casual") {
        showProducts("Casual Bags");
    }
    else if (page === "sale") {
        showSale();
    }
    else if (page === "cart") {
        showCart();
    }
    else if (page === "wishlist") {
        showWishlist();
    }
    else if (page === "about") {
        showAbout();
    }
    else {
        showHome();
    }
}

// Home page
function showHome() {

    content.innerHTML = `
        <section class="hero section">

            <div class="hero-content">

                <p class="small-title">
                    COLLEGE COLLECTION 2026
                </p>

                <h1>
                    CARRY YOUR <span>COLLEGE STYLE.</span>
                </h1>

                <p>
                    Smart, stylish and comfortable bags
                    made for your everyday college life.
                </p>

                <a href="#shop" class="main-btn">
                    SHOP COLLECTION →
                </a>

            </div>

        </section>

        <section class="section">

            <p class="small-title">
                FIND YOUR PERFECT BAG
            </p>

            <div class="section-title">
                <h2>Shop By Category</h2>
                <a href="#shop">View All →</a>
            </div>

            <div class="category-grid">

                <div class="category-card">
                    <img src="${products[0].image}" alt="Backpack">
                    <h3>College Backpacks</h3>
                    <a href="#backpacks">Explore →</a>
                </div>

                <div class="category-card">
                    <img src="${products[1].image}" alt="Laptop bag">
                    <h3>Laptop Bags</h3>
                    <a href="#laptop">Explore →</a>
                </div>

                <div class="category-card">
                    <img src="${products[6].image}" alt="Casual bag">
                    <h3>Casual Bags</h3>
                    <a href="#casual">Explore →</a>
                </div>

            </div>

        </section>

        <section class="section">

            <p class="small-title">
                STUDENT FAVOURITES
            </p>

            <div class="section-title">
                <h2>Best Selling College Bags</h2>
                <a href="#shop">Shop All →</a>
            </div>

            <div class="product-grid">
                ${products.slice(0, 4).map(productCard).join("")}
            </div>

        </section>

        <section class="promo section">

            <div>
                <p class="small-title">BACK TO COLLEGE</p>

                <h2>YOUR CAMPUS. YOUR STYLE.</h2>

                <p>
                    Find the perfect bag for classes,
                    laptops and everyday use.
                </p>
            </div>

            <a href="#shop" class="main-btn">
                SHOP NOW →
            </a>

        </section>

        <section class="section">

            <div class="section-title">
                <h2>Why Choose BagZone?</h2>
            </div>

            <div class="benefits">

                <div class="benefit">
                    <h3>01</h3>
                    <h4>Spacious Design</h4>
                    <p>Room for books and essentials</p>
                </div>

                <div class="benefit">
                    <h3>02</h3>
                    <h4>Laptop Friendly</h4>
                    <p>Dedicated laptop compartments</p>
                </div>

                <div class="benefit">
                    <h3>03</h3>
                    <h4>Everyday Comfort</h4>
                    <p>Designed for daily use</p>
                </div>

                <div class="benefit">
                    <h3>04</h3>
                    <h4>Affordable Style</h4>
                    <p>Student-friendly prices</p>
                </div>

            </div>

        </section>
    `;
}

// Product card
function productCard(product) {

    let liked = wishlist.includes(product.id);

    return `
        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>College Collection</p>

            <div class="price">
                ₹${product.price.toLocaleString("en-IN")}
            </div>

            <div class="product-actions">

                <button class="add-btn"
                    onclick="addToCart(${product.id})">
                    Add to Cart
                </button>

                <button class="wish-btn"
                    onclick="toggleWishlist(${product.id})">
                    ${liked ? "♥" : "♡"}
                </button>

            </div>

        </div>
    `;
}

// Product listing
function showProducts(category) {

    let list = products;

    if (category !== "All") {
        list = products.filter(p => p.category === category);
    }

    content.innerHTML = `
        <section class="section">

            <p class="small-title">
                BAGZONE COLLECTION
            </p>

            <div class="section-title">
                <h2>${category} Collection</h2>
            </div>

            <div class="filter-buttons">

                <button onclick="showProducts('All')">
                    All
                </button>

                <button onclick="showProducts('Backpacks')">
                    Backpacks
                </button>

                <button onclick="showProducts('Laptop Bags')">
                    Laptop Bags
                </button>

                <button onclick="showProducts('Casual Bags')">
                    Casual Bags
                </button>

            </div>

            <div class="product-grid">
                ${list.map(productCard).join("")}
            </div>

        </section>
    `;
}

// Sale page
function showSale() {

    let list = products.filter(p => p.price < 1500);

    content.innerHTML = `
        <section class="section">

            <p class="small-title">SPECIAL OFFERS</p>

            <h2>Student Special Collection</h2>

            <br>

            <div class="product-grid">
                ${list.map(productCard).join("")}
            </div>

        </section>
    `;
}

// Add product to cart
function addToCart(id) {

    let product = products.find(p => p.id === id);

    let item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    }
    else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();

    alert("Bag added to cart!");
}

// Save cart
function saveCart() {

    localStorage.setItem(
        "bagCart",
        JSON.stringify(cart)
    );

    updateCounts();
}

// Update counts
function updateCounts() {

    let count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    document.getElementById("cart-count").textContent = count;

    document.getElementById("wish-count").textContent = wishlist.length;
}

// Add or remove wishlist
function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist = wishlist.filter(
            item => item !== id
        );

    }
    else {
        wishlist.push(id);
    }

    localStorage.setItem(
        "bagWishlist",
        JSON.stringify(wishlist)
    );

    updateCounts();

    showPage();
}

// Wishlist page
function showWishlist() {

    let list = products.filter(
        p => wishlist.includes(p.id)
    );

    content.innerHTML = `
        <section class="section">

            <h2>My Wishlist</h2>

            <br>

            ${list.length === 0
                ? "<p>Your wishlist is empty.</p>"
                : `<div class="product-grid">
                    ${list.map(productCard).join("")}
                   </div>`
            }

        </section>
    `;
}

// Shopping cart
function showCart() {

    if (cart.length === 0) {

        content.innerHTML = `
            <h2>Your Cart is Empty</h2>
            <br>
            <a href="#shop" class="main-btn">
                Continue Shopping
            </a>
        `;

        return;
    }

    let total = 0;

    let html = "<h2>My Shopping Cart</h2>";

    cart.forEach(item => {

        total += item.price * item.quantity;

        html += `
            <div class="cart-item">

                <div>
                    <h3>${item.name}</h3>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>

                <div>
                    <button onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                    <button onclick="changeQuantity(${item.id}, -1)">
                        -
                    </button>

                    <button onclick="removeItem(${item.id})">
                        Remove
                    </button>
                </div>

            </div>
        `;
    });

    html += `
        <h2 class="total">
            Total: ₹${total.toLocaleString("en-IN")}
        </h2>

        <button class="main-btn" onclick="showCheckout()">
            Proceed to Checkout
        </button>
    `;

    content.innerHTML = html;
}

// Change quantity
function changeQuantity(id, amount) {

    let item = cart.find(p => p.id === id);

    if (item) {

        item.quantity += amount;

        if (item.quantity <= 0) {
            cart = cart.filter(p => p.id !== id);
        }

    }

    saveCart();

    showCart();
}

// Remove product
function removeItem(id) {

    cart = cart.filter(p => p.id !== id);

    saveCart();

    showCart();
}

// Checkout page
function showCheckout() {

    let total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    content.innerHTML = `
        <h2 style="text-align:center">
            Checkout
        </h2>

        <form id="checkout-form">

            <h3>Customer Details</h3>

            <input
                type="text"
                placeholder="Full Name"
                required
            >

            <input
                type="email"
                placeholder="Email Address"
                required
            >

            <input
                type="tel"
                placeholder="Mobile Number"
                pattern="[0-9]{10}"
                required
            >

            <textarea
                placeholder="Delivery Address"
                minlength="10"
                required
            ></textarea>

            <h3>
                Total Amount: ₹${total}
            </h3>

            <br>

            <button type="submit">
                Place Order
            </button>

        </form>
    `;

    document.getElementById("checkout-form")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        alert("Your demo order has been placed!");

        cart = [];

        saveCart();

        location.hash = "home";

    });
}

// About page
function showAbout() {

    content.innerHTML = `
        <section class="section">

            <h2>About BagZone</h2>

            <br>

            <p>
                BagZone is an online shopping website
                specially designed for college students.

                We offer stylish and affordable backpacks,
                laptop bags and casual bags for everyday
                campus life.
            </p>

        </section>
    `;
}

// Newsletter
document.getElementById("newsletter-form")
.addEventListener("submit", function(event) {

    event.preventDefault();

    alert("Thank you for subscribing!");

    this.reset();

});