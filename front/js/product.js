// get id for each items

const getArticleId = window.location.search;
const urlParams = new URLSearchParams(getArticleId);
const id = urlParams.get("id");

// affichage de l'article séléctionné par l'id

fetch(`http://localhost:3000/api/products/${id}`)
  .then((products) => products.json())
  .then((article => displayArticle(article)))
