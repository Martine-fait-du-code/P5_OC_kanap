// Récupération de l'id de chaque article

const getArticleId = window.location.search;
const urlParams = new URLSearchParams(getArticleId);
const id = urlParams.get("id");

// affichage de l'article séléctionné par l'id

fetch(`http://localhost:3000/api/products/${id}`)
  .then((products) => products.json())
  .then((article) => displayArticle(article));

function displayArticle(article) {
  document.getElementById("title").innerHTML = article.name;
  document.getElementsByClassName(
    "item__img"
  )[0].innerHTML = `<img src=${article.imageUrl} alt=${article.altTxt}>`;
  document.getElementById("price").innerHTML = article.price;
  document.getElementById("description").innerHTML = article.description;

  const articleOption = article.colors.map(
    (color) => `<option value=${color}>${color}</option>`
  );
  const colorSelect = `<option value="">--SVP, choisissez une couleur --</option> ${articleOption}`;
  document.getElementById("colors").innerHTML = colorSelect;
}
