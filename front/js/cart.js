window.addEventListener("load", (e) => {
  refreshCart();
});

function refreshCart() {
  //  const cartContent = [];
  const itemsInCart = localStorage.length;

  for (let i = 0; i < itemsInCart; i++) {
    let itemId = localStorage.key(i);

    fetch(`http://localhost:3000/api/products/${itemId}`)
      .then((products) => products.json())
      .then((itemApi) => {
        const items = localStorage.getItem(itemId);

        const kanap = {
          id: itemId,
          price: itemApi.price,
          image: itemApi.imageUrl,
          altTxt: itemApi.altTxt,
        };

        const itemObject = JSON.parse(items);

        const articlesInCart = {
          ...itemObject,
          ...kanap,
        }; //  cartContent.push(itemObject);

        displayItems(articlesInCart);
      });
    displayTotalCart();
  }
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
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${item.quantity}>
                  </div>
                <div class="cart__item__content__settings__delete">
              <div class="cart__item__content__settings__delete">
              <p id=${item.id}class="deleteItem">Supprimer</p>
            </div>
            </div>
            </div>
            </div>
              </div>
                </article>`;

  document.getElementById("cart__items").innerHTML += nodeArticle;
}
  

function displayTotalCart() {
  let totalQuantity = 0;
  let totalPrice = 0;
  Object.keys(localStorage).forEach(function (key) {
    const items = localStorage.getItem(key);
    const itemObject = JSON.parse(items);
    totalQuantity += parseInt(itemObject.quantity);
    totalPrice += itemObject.price * itemObject.quantity;
  });

  document.getElementById("totalQuantity").innerHTML = totalQuantity;
  document.getElementById("totalPrice").innerHTML = totalPrice;
}

function itemDeleted(item) {
  // alert(item.id);
  if (confirm("Supprimer cet article?")) {
    localStorage.removeItem(item.id);
    document.getElementById("cart__items").innerHTML = "";
    document.getElementById("totalQuantity").innerHTML = "";
    document.getElementById("totalPrice").innerHTML = "";
    refreshCart();
  }
}

function deleteBtns(buttons){
document.querySelectorAll(".deleteItem")
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    alert(btn.closest("article").getAttribute("data-id"));
    itemDeleted(btn.closest("article").getAttribute("data-id"));
  });
});
}

document
  .querySelector(".itemQuantity")
  .addEventListener("input", () => updateTotalCart(item.id, input.value));
function updateTotalCart(id, newValue) {
  const totalUpdated = localStorage.length.find((item) => item.id === id);
  totalUpdated.quantity = newValue;
}
