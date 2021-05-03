var express = require("express");
const { NotExtended } = require("http-errors");
var router = express.Router();
var PayRate = require("../payrate/Payrate");

router.get("/", function (req, res) {
    req.app.locals.payrate
    .getPayRate()
    .then((payrate) => res.json(payrate));
});

router.patch("/:id", function (req, res) {
    let result = req.app.locals.payrate
                .updatePayRate(req.params.id, req.body);
    console.log(result);
    if ( result ) {
        res.status(200);
        res.send("Successfully updated");
    }
    else {
        res.status(500);
        res.send("Unable to update payrate");
    }

    
    
});


module.exports = router;