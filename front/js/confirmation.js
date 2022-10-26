function getOrderId() {

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
return urlParams.get("orderId");
}

 const getOrder = getOrderId() 
console.log(orderId)