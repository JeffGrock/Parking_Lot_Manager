/** Express router providing reservation related routes
 * @module routes/reservations
 * @requires express
 */

var express = require("express");
/**
 * Express router to mount reservation related functions on.
 * @type {object}
 * @const
 * @namespace reservationRouter
 */
var router = express.Router();
/**
 * Route to get reservations.
 * @name get/reservations
 * @function
 * @memberof module:routes/reservations~reservationRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/", function (req, res) {
  if (req.query.email) {
    req.app.locals.reservation
      .getReservation(req.query.email)
      .then((reservation) => res.json(reservation));
  } 
  else if (req.query.from_date && req.query.to_date) {
    req.app.locals.reservation
    .getReservationsByDateRange(req.query.from_date,req.query.to_date)
    .then((reservation) => res.json(reservation));
  }
  else {
    req.app.locals.reservation
      .getReservations()
      .then((reservations) => res.json(reservations));
  }
});

/**
 * Route to post reservations.
 * @name post/reservations
 * @function
 * @memberof module:routes/reservations~reservationRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post("/", function (req, res) {
  let requestBody = req.body;
  let reservation = req.app.locals.reservation;
  reservation.makeReservation(
    requestBody.email,
    requestBody.phoneNumber,
    requestBody.storeID,
    requestBody.dateTime,
    requestBody.amount
  );
  res.status(201);
  res.send("Success");
});

/**
 * Route to delete reservations.
 * @name delete/reservations
 * @function
 * @memberof module:routes/reservations~reservationRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.delete("/", function (req, res) {
  req.app.locals.reservation.cancelReservation(req.query.email);
  res.status(202);
  res.send("Success");
});

module.exports = router;
