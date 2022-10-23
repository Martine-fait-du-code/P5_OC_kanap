function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
  let cart = localStorage.getItem("cart");

  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((p) => p.id_color != productId);
  saveCart(cart);
}

function changeQuantity(productId, quantity) {
  let cart = getCart();
  let productFound = cart.find((p) => p.id_color == productId);
  if (productFound != undefined) {
    productFound.quantity = quantity;
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart(cart);
    }
  }
}

function getTotalProduct() {
  let cart = getCart();
  let number = 0;
  for (let product of cart) {
    number += parseInt(product.quantity);
  }
  return number;
}

function getTotalPrice() {
  let cart = getCart();
  let total = 0;
  for (let product of cart) {
    total += product.quantity * product.price;
  }
  return total;
}

async function getOneProductDataFromApi(product) {
  let itemApi = await fetch(`http://localhost:3000/api/products/${product.id}`)
    .then((products) => products.json())
    .then((article) => {
      return article;
    });
  product.id.split("_")[0];

  const kanap = {
    price: itemApi.price,
    image: itemApi.imageUrl,
    altTxt: itemApi.altTxt,
  };

  const elem = {
    ...product,
    ...kanap,
  };

  displayItems(elem);
  addEvents();
}

function getAllCartData() {
  let cartFromStorage = getCart();
  cartFromStorage.forEach((item) => {
    getOneProductDataFromApi(item);
  });
}

/*
###### VIEW
*/

window.addEventListener("load", (e) => {
  refreshCartView();
  // addEvents();
});

function refreshCartView() {
  resetCartView();
  getAllCartData();
  document.getElementById("totalQuantity").innerHTML = getTotalProduct();
  document.getElementById("totalPrice").innerHTML = getTotalPrice();
}

function displayItems(item) {
  const nodeArticle = `<article class="cart__item" data-id="${
    item.id + item.color
  }" data-color="${item.color}">
                <div class="cart__item__img">
                  <img src=${item.image} alt=${item.altTxt}>
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${item.name}</h2>
                    <p>${item.color}</p>
                    <p>${item.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input id="qty_${item.id + item.color}" data-id=${
    item.id + item.color
  } type="number" class="itemQuantity" name="itemQuantity" min="0" max="100" value=${
    item.quantity
  }>
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <div class="cart__item__content__settings__delete">
                      <p id="btn_${item.id + item.color}}" data-id=${
    item.id + item.color
  } class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                    </div>
                  </div>
                </div>
              </article>`;
  document.getElementById("cart__items").innerHTML += nodeArticle;

  // let btn = document.getElementById("btn_" + item.id);
  // btn.addEventListener("click", () => {
  //   itemDeleted(btn.closest("article").getAttribute("data-id"));
  // });

  // let qty = document.getElementById("qty_" + item.id);
  // qty.addEventListener("change", () => {
  //   updateTotalCart(qty.closest("article").getAttribute("data-id"), qty.value);
  // });
}

function addEvents() {
  //delete button
  const buttons = document.querySelectorAll(".deleteItem");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      itemDeleted(btn.closest("article").getAttribute("data-id"));
    });
  });

  const QtyFields = document.querySelectorAll(".itemQuantity");
  QtyFields.forEach((field) => {
    field.addEventListener("change", () => {
      updateTotalCart(
        field.closest("article").getAttribute("data-id"),
        field.value
      );
    });
  });
}

function updateTotalCart(id, quantity) {
  changeQuantity(id, quantity);
  refreshCartView();
}

function itemDeleted(itemId) {
  if (confirm("Supprimer cet article?")) {
    removeFromCart(itemId);
    refreshCartView();
  }
}

function resetCartView() {
  document.getElementById("cart__items").innerHTML = "";
  document.getElementById("totalQuantity").innerHTML = "";
  document.getElementById("totalPrice").innerHTML = "";
}

// --------------ORDER--------------------

const orderBtn = document.querySelector("#order");
orderBtn.addEventListener("click", (e) => submitForm(e));

function submitForm(e) {
  e.preventDefault();
  let cart = getCart();
  if (cart.length === 0) {
    alert("Votre panier est vide!")
    return
  }


  const body = getFormValues();
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
    
}

function getFormValues() {
  const cartForm = document.querySelector(".cart__order__form");
  const firstName = cartForm.elements.firstName.value;
  const lastName = cartForm.elements.lastName.value;
  const address = cartForm.elements.address.value;
  const city = cartForm.elements.city.value;
  const email = cartForm.elements.email.value;
  

  const bodyForm = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdsInCart(),
  };
  return bodyForm;
}

function getIdsInCart() {
  let idTab = [];
  const cart = getCart();
  cart.forEach((item) => {
    if (!idTab.includes(item.id)) idTab.push(item.id);
  });
  return idTab;
}

// function formValidation() {
  
// }