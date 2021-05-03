const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config(); // Access to .env variables

const database = require("./database/Database");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const reservationsRouter = require("./routes/reservations");
const cameraRouter = require("./routes/camera");
const parkingLotRouter = require("./routes/parkingLot");
const payrateRouter = require("./routes/payrate");
const ParkingLot = require("./parkingLot/ParkingLot");
const PayRate = require("./payrate/Payrate");
const Registration = require("./registration/Registration");
const Reservation = require("./reservation/Reservation");
const User = require("./user/User");

const app = express();
//declared in the app.js which is basically treated as main
//assigning them to app.local makes it so they can be accessed in the routes
app.locals.db = new database();
app.locals.parkingLot = new ParkingLot(app.locals.db);
app.locals.payrate = new PayRate(app.locals.db);
app.locals.registration = new Registration(app.locals.db);
app.locals.user = new User(app.locals.db);
app.locals.reservation = new Reservation(
  app.locals.db,
  app.locals.parkingLot,
  app.locals.user
);
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serves static files
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/src",
  express.static(
    path.join(__dirname, "../../Group-Project-CSCI-441-Frontend/src")
  )
);
app.use(
  "/modals",
  express.static(
    path.join(__dirname, "../../Group-Project-CSCI-441-Frontend/modals")
  )
);

// Passport and session configuration
app.use(flash());
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    app.locals.user.authenticateUser()
  )
);

passport.serializeUser(app.locals.user.serializeUser());
passport.deserializeUser(app.locals.user.deserializeUser());

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/reservations", reservationsRouter);
app.use("/camera", cameraRouter);
app.use("/parkingLot", parkingLotRouter);
app.use("/payrate", payrateRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.error(err.stack);
  res.json({ error: err });
  res.status(err.status || 500);
});

module.exports = app;
