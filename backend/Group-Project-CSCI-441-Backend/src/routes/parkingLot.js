var express = require("express");
const app = require("../app");
var router = express.Router();

/**
 * Used to get the parking lot object
 * @name get/
 * @function
 * @memberof module:routes/parkingLot
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/", async function (req, res) {
  let lot;
  try {
    lot = await req.app.locals.parkingLot.getCurrentParkingLot();
    if (lot == null) {
      return res.status(404).json({ message: "Unable to retrieve parking lot" });
    }
    return res.json(lot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  return res.send(lot);  
});

router.patch("/", function (req, res) {
  req.app.locals.parkingLot.updateParkingLot(req.body);
  res.status(201);
  res.send("Success");
});

router.post("/", function (req, res) {
  req.app.locals.parkingLot.addParkingLot();
  res.status(201);
  res.send("Success");
});

module.exports = router;
