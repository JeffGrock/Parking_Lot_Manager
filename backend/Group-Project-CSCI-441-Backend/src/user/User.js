/**
 * Represents a User.
 */
class User {
  /**
   * Constructor for User.
   * @constructor
   * @param {DataBase} db - A reference to the database instance.
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * Gets user by ID
   * @param {string} id - The ID of the user.
   * @returns {object} - A user.
   */
  getUserById(id) {
    return this.db.getUserById(id);
  }

  /**
   * Gets user by token
   * @param {string} token - Token for password reset
   * @returns {object} - A user.
   */
  getUserByToken(token) {
    return this.db.getUserByToken(token);
  }

  /**
   * Sets the reset password token and token's expiration based on email
   * @param {string} email - User's email
   * @param {string} token - Reset password token
   * @param {Date} date - Reset password token's expiration
   */
  setUserResetPasswordToken(email, token, date) {
    return this.db.setUserResetPasswordToken(email, token, date);
  }

  /**
   * @desc  Unsets reset passwork token and expiration
   *        Updates user's password
   * @param {string} token - Reset passwork token
   * @param {string} password - New user password
   */
    unsetTokenAndUpdatePassword = async (token, password) => {
      return this.db.unsetTokenAndUpdatePassword(token, password);
    }

  /**
   * Gets user by email
   * @param {string} email - The email of the user.
   * @returns {object} - A user.
   */
  getUserByEmail(email) {
    return this.db.getUserByEmail(email);
  }

  /**
   * Gets user by email
   * @param {string} email - The email of the user.
   * @returns {object} - A user.
   */
  getUserByLicensePlateNumber(licensePlateNumber) {
    return this.db.getUserByLicensePlateNumber(licensePlateNumber);
  }

  /**
   * Gets all users
   * @returns {Array} - All users.
   */
  getUsers() {
    return this.db.getUsers();
  }

  /**
   * Adds a user
   * @param {string} firstName - the first name of the user
   * @param {string} lastName - the last name of the user
   * @param {string} phone - the phone number of the user
   * @param {string} email - the email of the user
   * @param {string} password - the password of the user
   * @param {string} permissions - the permissions the user has
   * @param {DateTime} modified_date - the date the user was last modified
   * @param {string} modified_by - the identifer of the user who modified this user
   * @param {string} paymentMethod - the payment method of the user
   * @param {Array} vehicles - the vehicles that the user plans to make reservations for
   */
  addUser({
    firstName,
    lastName,
    phone,
    email,
    password,
    permissions,
    modified_date,
    modified_by,
    paymentMethod,
    vehicles,
  }) {
    this.db.addUser({
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      password: password,
      permissions: permissions,
      modified_date: modified_date,
      modified_by: modified_by,
      paymentMethod: paymentMethod,
      vehicles: vehicles,
    });
  }

  /**
   * Updates the current user
   * @param {object} user - The current User
   * @returns {object} - The updated user
   */
  updateUser(user) {
    return this.db.updateUser(user);
  }

  /**
   * Authenticates the current user
   * @param {object} user - The current User
   * @param {string} password - The users password
   * @returns {object} - If the user password and username are correct
   */
  authenticateUser(email, password) {
    return this.db.authenticateUser;
  }

  /**
   * Result is attached to the session as req.session.passport.user
   *
   * @returns {function} Callback function:
   * @param {string} id - _id stored in mongodb
   * @param {function} done - called internally by strategy implementation
   * @memberof User
   */
  serializeUser() {
    return function (user, done) {
      done(null, user._id);
    };
  }

  /**
   * In ID is used to find the user, which is then restored in req.user
   *
   * @returns {function} Async callback function:
   * @param {string} id - Corresponds to _id in mongo database
   * @param {function} done - called internally by strategy implementation
   * @memberof User
   */
  deserializeUser() {
    return async function (id, done) {
      const user = await this.getUserById(id);
      done(null, user);
    }.bind(this);
  }
}

module.exports = User;
