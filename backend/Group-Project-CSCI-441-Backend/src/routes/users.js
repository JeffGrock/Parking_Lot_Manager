/** Express router providing reservation related routes
 * @module routes/users
 * @requires express
 */

var express = require("express");
const { NotExtended } = require("http-errors");
/**
 * Express router to mount users related functions on.
 * @type {object}
 * @const
 * @namespace usersRouter
 */
var router = express.Router();

/**
 * Used to pass data to dashboard html file, since GET /dashboard sends just html file without user data
 * @name get/loggedIn
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/loggedIn", function (req, res) {
  if (req.isAuthenticated()) {
    const { password, ...user } = req.user;
    res.json(user);
  }
  else res.redirect('/login');
});

/**
 * Used to get user with specified ID
 * @name get/users
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} pathWithID - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/:id", async function (req, res) {
  let user;
  try {
    user = await req.app.locals.user.getUserById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Unable to locate user" });
    }

    return res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  return res.send(user);
});

/**
 * Used to get all users
 * @name get/users
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/", function (req, res) {
  req.app.locals.user.getUsers().then((users) => res.json(users));
});

module.exports = router;
