const { ObjectId } = require("mongodb");

var MongoClient = require("mongodb").MongoClient;
var MongoUri = require("../constants/Keys").MONGODB_URI;
const bcrypt = require("bcrypt");
const { json } = require("express");
/**
 * Represents the Database.
 */
class Database {
  /**
   * Constructor for Database handles the connection to MongoDB.
   * @constructor
   */
  constructor() {
    MongoClient.connect(MongoUri, (err, db) => {
      if (!err) {
        this.db = db.db("test");
        console.log("We are connected");
      }
    });
  }

  /**
   * Adds a reservation to the database
   * @param {object} reservation - the reservation to add to the database
   */
  addReservation = (reservation) => {
    this.db.createCollection(
      "reservations",
      { strict: true },
      (err, collection) => {}
    );
    var collection = this.db.collection("reservations");
    collection.insertOne(reservation);
  };

  /**
   * Get the reservation associated with email address from the database
   * @param {string} userEmail - the email address of the user who created the reservation
   * @returns {object} - Reservation
   */
  getReservation = async (userEmail) => {
    var collection = this.db.collection("reservations");
    var reservation = await collection.findOne({
      email: userEmail,
      isComplete: false,
    });
    return reservation;
  };

  /**
   * Gets all reservations from the database
   * @returns {Array} - All Reservations
   */
  getReservations = async () => {
    var collection = this.db.collection("reservations");
    var cursor = collection.find();
    var reservations = [];
    while (await cursor.hasNext()) {
      reservations.push(await cursor.next());
    }
    return reservations;
  };

  /**
   * Gets all reservations within a specified date range
   * @returns {Array} - Reservations within date range
   */
  getReservationsByDateRange = async (from_date, to_date) => {
    var collection = this.db.collection("reservations");
    var cursor = collection.find({
      isComplete: true,
      arrival: { $gte: from_date },
      departure: { $lte: to_date }
    });
    var reservations = [];
    while (await cursor.hasNext()) {
      reservations.push(await cursor.next());
    }
    return reservations;
  };

   /** Update the reservation arrival time
   * @param {string} email - the email address of the user who created the reservation
   * @param {Date} arrival - the arrival date and time of the car
   */
  updateReservationArrival = (email, arrival) => {
    let collection = this.db.collection("reservations");
    collection.updateOne(
      { email: email, isComplete: false },
      { $set: { arrival: arrival } }
    );
  };

  /**
   * Update the reservation arrival time
   * @param {string} email - the email address of the user who created the reservation
   * @param {Date} departure - the arrival date and time of the car
   */
  updateReservationDeparture = (email, departure, amount) => {
    let collection = this.db.collection("reservations");
    collection.updateOne(
      { email: email, isComplete: false },
      { $set: { departure: departure, isComplete: true, amount: amount } }
    );
  };

  /**
   * Deletes reservation for the specified email address from the database
   * @param {string} email - the email address of the user who created the reservation
   */
  deleteReservation = (userEmail) => {
    var collection = this.db.collection("reservations");
    collection.deleteOne({ email: userEmail });
  };

  /**
   * Gets user by ID from the database
   * @param {string} id - The ID of the user.
   * @returns {object} - A user.
   */
  getUserById = async (id) => {
    let result;
    let collection = this.db.collection("users");
    result = await collection.findOne({ _id: ObjectId(id) });
    return result;
  };

  /**
   * Gets user by password reset token that is not expired from the database
   * @param {string} token - The password reset token
   * @returns {object} - A user.
   */
  getUserByToken = async (token) => {
    let user;
    let collection = this.db.collection("users");
    user = await collection.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: new Date()
      }
    });
    return user;
  };

  /**
   * Sets the reset password token and token's expiration based on email
   * @param {string} email - User's email
   * @param {string} token - Reset password token
   * @param {Date} date - Reset password token's expiration
   */
  setUserResetPasswordToken = async (email, token, date) => {
    let collection = this.db.collection("users");
    const updatedUser = await collection.findOneAndUpdate(
      { email: email },
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpires: date
        }
      },
      {
        returnOriginal: false
      }
    );

    return updatedUser;
  };

  /**
   * @desc  Unsets reset passwork token and expiration
   *        Updates user's password
   * @param {string} token - Reset passwork token
   * @param {string} password - New user password
   */
  unsetTokenAndUpdatePassword = async (token, password) => {
    let collection = this.db.collection("users");

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Finds in database matching token, and only token that has not expired
    // Removes the resetPasswordToken and resetPasswordExpires from user
    // Updates the user's password for new hashed password
    // Updates the modified_date and modified_by
    const updatedUser = await collection.findOneAndUpdate(
      {
        resetPasswordToken: token,
        resetPasswordExpires: {
          $gt: new Date()
        }
      },
      {
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpires: ""
        },
        $set: {
          password: hashedPassword,
          modified_date: new Date().toISOString().split("T")[0],
          modified_by: "1"
        }
      },
      {
        returnOriginal: false
      }
    );

    return updatedUser;
  };

  /**
   * Gets user by email from the database
   * @param {string} email - The email of the user.
   * @returns {object} - A user.
   */
  getUserByEmail = async (email) => {
    let result;
    let collection = this.db.collection("users");
    result = await collection.findOne({ email: email });
    return result;
  };

  /**
   * Gets user by email from the database
   * @param {string} licensePlate - The License Plate of the users car.
   * @returns {object} - A user.
   */
  getUserByLicensePlateNumber = async (licensePlate) => {
    let collection = this.db.collection("users");
    let result = await collection.findOne({
      vehicles: licensePlate,
    });
    return result;
  };

  /**
   * Gets all users from the database
   * @returns {Array} - All users.
   */
  getUsers = async () => {
    var collection = this.db.collection("users");
    var cursor = collection.find();
    var users = [];
    while (await cursor.hasNext()) {
      users.push(await cursor.next());
    }
    return users;
  };

  /**
   * Adds a user to the database
   * @param {object} user - the user that is being added to the database
   */
  addUser = (user) => {
    this.db.createCollection(
      "users",
      { strict: true },
      (err, collection) => {}
    );

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);

    var collection = this.db.collection("users");
    collection.insertOne(user);
  };

  /**
   * Updates a user in the database
   * @param {object} user - The current User
   * @returns {object} - The updated user
   */
  updateUser = async (user) => {
    const collection = this.db.collection("users");
    let updatedUser;

    // User includes an update to their password
    if (user.password && user.password !== "") {
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      // Update in mongo db
      updatedUser = await collection.findOneAndUpdate(
        { _id: ObjectId(user._id) },
        {
          $set: {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
            permissions: user.permissions,
            modified_date: user.modified_date,
            modified_by: user.modified_by,
            paymentMethod: user.paymentMethod,
            vehicles: user.vehicles,
            password: user.password,
          },
        },
        {
          returnOriginal: false,
        }
      );
    } else {
      // If user did not update password, keep the old hashed pw and update mongo db for anything else
      updatedUser = await collection.findOneAndUpdate(
        { _id: ObjectId(user._id) },
        {
          $set: {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
            permissions: user.permissions,
            modified_date: user.modified_date,
            modified_by: user.modified_by,
            paymentMethod: user.paymentMethod,
            vehicles: user.vehicles,
          },
        },
        {
          returnOriginal: false,
        }
      );
    }

    return updatedUser;
  };

  /**
   * Authenticates the a user with the database
   * @param {string} email - The current User
   * @param {string} password - The users password
   * @param {function} done - The callback function when the operation is complete
   * @returns {object} - If the user password and username are correct
   */
  authenticateUser = (email, password, done) => {
    let collection = this.db.collection("users");

    collection.findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  };

  /**
   * Add a parking lot to the database
   * @param {object} parkingLot - the parking lot object
   */
  addParkingLot = async (parkingLot) => {
    this.db.createCollection(
      "parkingLot",
      { strict: true },
      (err, collection) => {}
    );
    var collection = this.db.collection("parkingLot");
    collection.insertOne(parkingLot);
  };

  /**
   * Rerieve parking lot object
   */
  getCurrentParkingLot = async () => {
    var collection = this.db.collection("parkingLot");
    var current = await collection.findOne();
    return current;
  };

  /**
   * Delete the current parking lot object and re-add the updated one
   * @param {object} defaultLot
   */
  deleteParkingLot = (defaultLot) => {
    var collection = this.db.collection("parkingLot");
    collection.deleteOne();
    collection.addOne(defaultLot);
  };

  /**
   * Update the current parking lot object
   * @param {object} newLot
   */
  updateParkingLot = (newLot) => {
    //Another collection pointer is needed for the insert, otherwise a duplicate object id exception is thrown
    var collectionDelete = this.db.collection("parkingLot");
    collectionDelete.deleteOne();
    var collectionAdd = this.db.collection("parkingLot");
    newLot._id = ObjectId(newLot._id);
    collectionAdd.insertOne(newLot);
  };

  /**
   * Gets the current parking rate per hour
   */
  getPayRate = async () => {
    let collection = this.db.collection("control");
    let payrate = collection.findOne();
    return await payrate;
  };

  /**
   * Updates the current parking rate per hour
   * @param int id - The object Id relating to the payment rate record
   * @param {object} data - The parking rate data passed as JSON
   */
  updatePayRate = async (id, data) => {
    let object_id = new ObjectId(id);
    let collection = this.db.collection("control");
    collection.updateOne({ _id: object_id }, { $set: data }, { upsert: true });
  };
}

module.exports = Database;
