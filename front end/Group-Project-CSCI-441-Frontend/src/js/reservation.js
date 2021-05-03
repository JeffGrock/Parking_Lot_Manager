const reservation_buttton = document.querySelector("#reservationButtton");
const chosen_store = document.querySelector("#storeSelector");
const date_and_time = document.querySelector("#reservationTime");
reservation_buttton.addEventListener("click", function (e) {
  e.preventDefault();
  $.get("http://localhost:3000/users/loggedIn", function (user) {
    console.log(user);
    data = {
      email: user.email,
      storeID: chosen_store.value,
      dateTime: date_and_time.value,
    };
    $.post("http://localhost:3000/reservations", data);
    location.href = "./dashboard";
  });
});
