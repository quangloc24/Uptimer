const popup = document.querySelector(".popup");
const popupclose = document.querySelector("#popupclose");
const allpopupbtn = document.querySelectorAll("button");
let ptype = "";
paypal
 .Buttons({
  createOrder: function () {
   return fetch("/pay", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({
     items: [
      {
       id: ptype,
       quantity: 1,
      },
     ],
    }),
   })
    .then((res) => {
     if (res.ok) return res.json();
     return res.json().then((json) => Promise.reject(json));
    })
    .then(({ id }) => {
     return id;
    })
    .catch((e) => {
     console.log(e);
    });
  },
  onApprove: function (data, actions) {
   return actions.order.capture();
  },
 })
 .render("#paypal");

function purchasepremium() {}

allpopupbtn.forEach((e) => {
 e.addEventListener("click", function (el) {
  ptype = e.id;
  console.log(ptype);
  popup.classList.remove("popup");
  popup.classList.add("popup-active");
 });
});
popupclose.addEventListener("click", function () {
 popup.classList.remove("popup-active");
 popup.classList.add("popup");
});
