/** Express router providing camera related routes
 * @module routes/camera
 * @requires express
 */

var express = require("express");
/**
 * Express router to mount camera related functions on.
 * @type {object}
 * @const
 * @namespace cameraRouter
 */
var router = express.Router();

/**
 * Route to put camera.
 * @name put/camera
 * @function
 * @memberof module:routes/camera~cameraRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put("/", function (req, res) {
  let reservation = req.app.locals.reservation;
  if (req.query.arrival != null) {
    reservation.updateReservationArrival(
      req.query.licensePlateNumber,
      req.query.arrival
    );
  } else if (req.query.departure != null) {
    reservation.updateReservationDeparture(
      req.query.licensePlateNumber,
      req.query.departure,
      req.query.amount
    );
  }

  res.status(204);
  res.send("Success");
});

module.exports = router;
