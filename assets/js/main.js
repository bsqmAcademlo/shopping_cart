let foods = [
    {
        id: "0",
        name: "Taco",
        price: 1200,
        stock: 5,
        urlImage: "./assets/images/algoRaro.png",
    },
    {
        id: "1",
        name: "Comida sana",
        price: 1300,
        stock: 7,
        urlImage: "./assets/images/comidaSana.png",
    },
    {
        id: "2",
        name: "Ensalada",
        price: 1400,
        stock: 8,
        urlImage: "./assets/images/ensalada.png",
    },
    {
        id: "3",
        name: "Hamburguesa",
        price: 1400,
        stock: 8,
        urlImage: "./assets/images/hambur.png",
    },
    {
        id: "4",
        name: "Perrito",
        price: 1500,
        stock: 5,
        urlImage: "./assets/images/perrito.png",
    },
    {
        id: "5",
        name: "Pez",
        price: 2000,
        stock: 3,
        urlImage: "./assets/images/pez.png",
    },
    {
        id: "6",
        name: "Pizza",
        price: 3000,
        stock: 11,
        urlImage: "./assets/images/pizza.png",
    },
];

import "./handleNavbar.js";

const products = document.querySelector(".products");
const cartProducts = document.querySelector(".carProducts");
const carTotal = document.querySelector(".carTotal");
const amountCart = document.querySelector(".amountCart");

foods = JSON.parse(localStorage.getItem("foods")) || foods;
let objCart = JSON.parse(localStorage.getItem("objCart")) || {};

function verifyAddToCart(findProduct, id) {
    if (findProduct.stock === objCart[id].amount) {
        alert("No tengo mas en stock");
    } else {
        objCart[id].amount++;
    }
}

function seacrProduct(id) {
    return foods.find(function (food) {
        return food.id === id;
    });
}

function deleteProduct(id) {
    const res = confirm("Seguro quieres eliminar este producto");
    if (res) delete objCart[id];
}

function printAmountCart() {
    let sum = 0;

    const arrayCart = Object.values(objCart);

    if (!arrayCart.length) {
        amountCart.style.display = "none";
        return;
    }

    amountCart.style.display = "inline-block";

    arrayCart.forEach(function ({ amount }) {
        sum += amount;
    });

    amountCart.textContent = sum;
}

function printTotalCart() {
    const arrayCart = Object.values(objCart);

    if (!arrayCart.length) {
        carTotal.innerHTML = `
            <h3>No hay nada, a comprar!!!</h3>
        `;

        return;
    }

    let sum = 0;

    arrayCart.forEach(function ({ amount, price }) {
        sum += amount * price;
    });

    carTotal.innerHTML = `
            <h3>Total a pagar ${sum}</h3>
            <button class="btn btn__buy">Comprar</button>
        `;
}

function printProductsInCart() {
    let html = "";

    const arrayCart = Object.values(objCart);

    arrayCart.forEach(function ({ id, name, price, urlImage, amount }) {
        html += `
            <div class="product">
                <div class="product__img">
                    <img src="${urlImage}" alt="${name}" />
                </div>

                <div class="product__info">
                    <p>${name}</p>
                    <p>${price}</p>
                    <p>Cant: ${amount}</p>
                </div>

                <div class="product__options" id="${id}">
                    <i class='bx bx-minus'></i>
                    <i class='bx bx-plus'></i>
                    <i class='bx bx-trash' ></i>
                </div>
            </div>
        `;
    });

    cartProducts.innerHTML = html;
}

function printProducts() {
    let html = "";

    foods.forEach(function ({ id, name, price, stock, urlImage }) {
        const typeButton = stock
            ? '<button class="btn btn__add">Comprar</button>'
            : '<button class="btn btn__NA">N / A</button>';

        html += `
            <div class="product">
                <div class="product__img">
                    <img src="${urlImage}" alt="${name}" />
                </div>

                <div class="product__info">
                    <p>Nombre: ${name}</p>
                    <p>Precio: ${price}</p>
                    <p>Stock: ${stock}</p>
                </div>

                <div class="product__options" id="${id}">
                    ${typeButton}
                </div>
            </div>
        `;
    });

    products.innerHTML = html;
}

products.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn__add")) {
        // obtenemos el id
        const id = e.target.parentElement.id;

        // vamos a obtener el producto por id
        let findProduct = seacrProduct(id);

        if (findProduct.stock === 0) return alert("Ya no tengo mas");

        if (objCart[id]) {
            // logica para el carrito
            verifyAddToCart(findProduct, id);
        } else {
            objCart[id] = {
                ...findProduct,
                amount: 1,
            };
        }

        localStorage.setItem("objCart", JSON.stringify(objCart));
    }

    printProductsInCart();
    printTotalCart();
    printAmountCart();
});

cartProducts.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-minus")) {
        const id = e.target.parentElement.id;

        if (objCart[id].amount === 1) {
            deleteProduct(id);
        } else {
            objCart[id].amount--;
        }
    }

    if (e.target.classList.contains("bx-plus")) {
        const id = e.target.parentElement.id;
        let findProduct = seacrProduct(id);
        verifyAddToCart(findProduct, id);
    }

    if (e.target.classList.contains("bx-trash")) {
        const id = e.target.parentElement.id;
        deleteProduct(id);
    }

    localStorage.setItem("objCart", JSON.stringify(objCart));

    printProductsInCart();
    printTotalCart();
    printAmountCart();
});

carTotal.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn__buy")) {
        const res = confirm("Seguro quieres hacer la compra");

        if (!res) return;

        let newArray = [];

        foods.forEach(function (food) {
            if (food.id === objCart[food.id]?.id) {
                newArray.push({
                    ...food,
                    stock: food.stock - objCart[food.id].amount,
                });
            } else {
                newArray.push(food);
            }
        });

        foods = newArray;
        objCart = {};

        localStorage.setItem("objCart", JSON.stringify(objCart));
        localStorage.setItem("foods", JSON.stringify(foods));

        printProducts();
        printProductsInCart();
        printTotalCart();
        printAmountCart();
    }
});

printProducts();
printTotalCart();
printAmountCart();
printProductsInCart();
