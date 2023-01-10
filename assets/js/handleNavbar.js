const iconCart = document.querySelector(".bx-cart-add");
const contentCart = document.querySelector(".contentCar");

iconCart.addEventListener("click", function () {
    contentCart.classList.toggle("contentCar__show");
});
