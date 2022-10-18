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
  cart = cart.filter((p) => p.id != productId);
  saveCart(cart);
}

function changeQuantity(productId, quantity) {
  let cart = getCart();
  let productFound = cart.find((p) => p.id == productId);
  if (productFound != undefined) {
    productFound.quantity = quantity;
    if (productFound <= 0) {
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

function getOneProductDataFromApi(product) {
  fetch(`http://localhost:3000/api/products/${product.id}`)
    .then((products) => products.json())
    .then((itemApi) => {
      const kanap = {
        id: product.id,
        price: itemApi.price,
        image: itemApi.imageUrl,
        altTxt: itemApi.altTxt,
      };
      const data = {
        ...product,
        ...kanap,
      };

      displayItems(data);
    });
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
  //addEvents();
});

function refreshCartView() {
  resetCartView();
  getAllCartData();

  document.getElementById("totalQuantity").innerHTML = getTotalProduct();
  document.getElementById("totalPrice").innerHTML = getTotalPrice();
}

function displayItems(item) {
  const nodeArticle = `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
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
                      <input id="qty_${item.id}" data-id=${item.id} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${item.quantity}>
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <div class="cart__item__content__settings__delete">
                      <p id="btn_${item.id}" data-id=${item.id} class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                    </div>
                  </div>
                </div>
              </article>`;
  document.getElementById("cart__items").innerHTML += nodeArticle;

 

  let btn = document.getElementById("btn_" + item.id);
  btn.addEventListener("click", () => {
    itemDeleted(btn.closest("article").getAttribute("data-id"));
  });

  let qty = document.getElementById("qty_" + item.id);
  qty.addEventListener("change", () => {
    updateTotalCart(qty.closest("article").getAttribute("data-id"), qty.value);
  });
}

function addEvents() {
  //delete button
  const buttons = document.querySelectorAll(".deleteItem");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      itemDeleted(btn.closest("article").getAttribute("data-id"));
    });
  });
  

  //Quantity field
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
