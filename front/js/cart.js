// console.log("produits ajoutés:", itemsInCart);
const cartContent = [];

// function getItemsInCart() {
const itemsInCart = localStorage.length;

for (let i = 0; i < itemsInCart; i++) {
  let itemId = localStorage.key(i);

  fetch(`http://localhost:3000/api/products/${itemId}`)
    .then((products) => products.json())
    .then((itemApi) => {
      // console.log(itemApi);

      const items = localStorage.getItem(itemId);

      const kanap = {
        id: itemId,
        price: itemApi.price,
        image: itemApi.imageUrl,
        altTxt: itemApi.altTxt,
      };

      const itemObject = JSON.parse(items);
      // clonage de kanaps
      const itemsInCart = {
        ...itemObject,
        ...kanap,
      };

      console.log("produit complet", itemsInCart);

      cartContent.push(itemObject);

      displayItems(itemsInCart);
    });
}

function displayItems(item) {
  const nodeArticle = `<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
                <div class="cart__item__img">
                  <img src=${item.image} alt=${item.altTxt}>
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${item.name}</h2>
                    
                    <p>${item.price}</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;

  document.getElementById("cart__items").innerHTML += nodeArticle;
}
