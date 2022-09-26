// Récupération de l'id de chaque article

const getArticleId = window.location.search;
const urlParams = new URLSearchParams(getArticleId);
const id = urlParams.get("id");

// affichage de l'article séléctionné par l'id

fetch(`http://localhost:3000/api/products/${id}`)
  .then((products) => products.json())
  .then((article) => {
    displayArticle(article);
    addToCart(article);
  });

function displayArticle(article) {
  document.getElementById("title").innerHTML = article.name;
  document.getElementsByClassName(
    "item__img"
  )[0].innerHTML = `<img src=${article.imageUrl} alt=${article.altTxt}>`;
  document.getElementById("price").innerHTML = article.price;
  document.getElementById("description").innerHTML = article.description;

  const articleColor = article.colors.map(
    (color) => `<option value=${color}>${color}</option>`
  );
  const colorSettings = `<option value="">--SVP, choisissez une couleur --</option> ${articleColor}`;
  document.getElementById("colors").innerHTML = colorSettings;
}

function addToCart(article) {
  const button = document.getElementById("addToCart");
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const chosenColor = document.getElementById("colors").value;
    const chosenQuantity = document.getElementById("quantity").value;
    if (chosenColor == null || chosenColor === "" || chosenQuantity <= 0)
      return;

    localStorage.setItem(
      article._id,
      `{color: "${chosenColor}", quantity:"${chosenQuantity}", name:"${article.name}"}`
    );
    window.location.href = "cart.html";
  });
}
