function getReservation(email) {
  const dateTime = $("#reservationTime");
  const spotNumber = $("#spotNumber");
  $.get("http://localhost:3000/reservations", { email: email }, function (
    reservation,
    status
  ) {
    dateTime.text(
      "Reservation Time And Date: " + reservation.reservationDateAndTime
    );
    spotNumber.text("Parking Spot Number: " + reservation.spotID);
  });
}
