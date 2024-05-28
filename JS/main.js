// Control de HTML - DOM
const productList = document.getElementById("productList");
const cartContainer = document.getElementById("cartContainer");

// Carga del carrito desde storage
let cart = JSON.parse(localStorage.getItem("cartInfo")) || [];


// Obtener productos desde API local
const getProducts = async () => {
    try {
        const resp = await fetch("../js/productos.json");
        products = await resp.json();

        // Armado de galería
        products.forEach((item) => {
            const productItem = document.createElement("div");
            productItem.className = "product-display";
            productItem.innerHTML = `
                <img class="card-img-top" src="${item.img}" alt="Imagen de ${item.name}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.beerStyle}</p>
                    <p class="card-text">Alc.Vol. ${item.abv}</p>
                    <p class="card-text">$ ${item.price}</p> 
                    <button class="btn btn-outline-secondary" onclick="addToCart(${item.id})">Añadir al carrito</button>
                </div>
            `;
            productList.append(productItem);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};
getProducts();

// Añadir a carrito
const addToCart = (idItem) => {
    const product = products.find(item => item.id === idItem);
    const repeat = cart.some(cartItem => cartItem.id === product.id);

    if (repeat) {
        cart = cart.map(cartItem => {
            if (cartItem.id === product.id) {
                cartItem.quantity++;
            }
            return cartItem;
        });
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    updateCart();
    saveCart();
    Toastify({
        text: "Producto agregado al carrito",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
};

// Actualizar carrito
const updateCart = () => {
    cartContainer.innerHTML = "";

    cart.forEach((item) => {
        const itemCarrito = document.createElement("div");
        itemCarrito.className = "cart-item";
        itemCarrito.innerHTML = `
            <img src="${item.img}" class="cart-img" alt="${item.name}">
            <div class="cart-details">
                <h5 class="cart-title">${item.name}</h5>
                <p class="cart-text">Precio: $${item.price}</p>
                <p class="cart-text">Cantidad: ${item.quantity}</p>
                <button class="btn btn-outline-danger" onclick="removeFromCart(${item.id})">Eliminar</button>
            </div>
        `;
        cartContainer.appendChild(itemCarrito);
    });

    calculateTotal();
};

// Eliminar del carrito
const removeFromCart = (idItem) => {
    cart = cart.filter(cartItem => cartItem.id !== idItem);
    updateCart();
    saveCart();
    Toastify({
        text: "Producto eliminado del carrito",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: {
            background: "linear-gradient(to right, #bf3243, #e7b2b8)",
        },
    }).showToast();
};

// Calcular total
const calculateTotal = () => {
    const total = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);
    document.getElementById("totalPagar").innerText = `Total: $${total}`;
};

// Local storage
const saveCart = () => {
    localStorage.setItem("cartInfo", JSON.stringify(cart));
};

// Finalizar compra
const finalizePurchase = () => {
    return new Promise((resolve, reject) => {
        if (cart.length > 0) {
            setTimeout(() => {
                resolve("Gracias por tu compra, disfruta tus cervezas");
            }, 2000);
        } else {
            reject("No hay cervezas en el carrito :(");
        }
    });
};

// Evento para finalizar la compra
document.getElementById("procederPago").addEventListener("click", () => {
    finalizePurchase()
        .then((message) => {
            Toastify({
                text: message,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                style: {
                    background: "#4fbe87",
                },
            }).showToast();

            cart = [];
            saveCart();
            updateCart();
        })
        .catch((error) => {
            Toastify({
                text: error,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "#e74c3c",
            }).showToast();
        });
});
