var express = require("express");
const passport = require("passport");
var router = express.Router();
var path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const middleware = require("../middleware/middleware");

/**
 * @desc    Serves the index page
 * @route   GET /
 */
router.get([ "/", "/index", "/index.html" ], function(req, res){
    res.sendFile(
        path.join(
            __dirname,
            "../../../Group-Project-CSCI-441-Frontend/index.html",
        ),
    );
});

/**
 * @desc    Serves the login page
 * @route   GET /login
 */
router.get([ "/login", "/login.html" ], function(req, res){
    if (req.isAuthenticated()) {
        res.redirect("/dashboard");
    }
    res.sendFile(
        path.join(
            __dirname,
            "../../../Group-Project-CSCI-441-Frontend/login.html",
        ),
    );
});

/**
 * @desc    Authenticates the user for login page
 * @route   POST /login
 */
router.post(
    [ "/login", "/login.html" ],
    middleware.emailToLowerCase,
    passport.authenticate("local"),
    function(req, res){
        // if authentication was successful, let ajax call handle the redirect
        res.send({ redirect: "/dashboard" });
    },
);

/**
 * @desc    Serves the forgot page
 * @route   GET /forgot
 */
router.get([ "/forgot", "/forgot.html" ], function(req, res){
    res.sendFile(
        path.join(
            __dirname,
            "../../../Group-Project-CSCI-441-Frontend/forgot.html",
        ),
    );
});

/**
 * @desc    Generates a token for resetting user's password
 *          Sets the token and token expiration on user in database
 * @route   POST /forgot
 */
router.post(
    [ "/forgot", "/forgot.html" ],
    middleware.emailToLowerCase,
    async function(req, res){
        try {
            // Store the reset token and token expiration in database
            let token = await crypto.randomBytes(20);
            token = token.toString("hex");

            // Token expires in 1 hour
            const tokenExpires = new Date(Date.now() + 3600000);

            // Sets the reset password token and expiration in db
            const user = (await req.app.locals.user.setUserResetPasswordToken(
                req.body.email,
                token,
                tokenExpires,
            )).value;

            if (!user) {
                // Email not in database for password reset
                res.status(404);
            } else {
                /**
                 * Steps:
                 *        1. In .env file, have the following environment variables
                 *                        EMAILUSER=email
                 *                        EMAILPW=password
                 *        2. If using gmail, https://stackoverflow.com/a/44133190
                 */

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAILUSER,
                        pass: process.env.EMAILPW,
                    },
                });

                let emailBody = `You are receiving this because you (or someone else) have requested the reset of the password for your account.

                Please click on the following link, or paste this into your browser to complete the process:

                http://${req.headers.host}/reset/${token}

                If you did not request this, please ignore this email.`;

                emailBody = emailBody.replace(/[\n][ \t]+/g, "\n");

                // send mail with defined transport object
                await transporter.sendMail({
                    from: `"Park n\' Go" <${process.env.EMAILUSER}>`, // sender address
                    to: `${req.body.email}`, // list of receivers
                    subject: "Park n' Go Password Reset", // Subject line
                    text: emailBody, // plain text body
                });

                res.status(200);
            }
            res.json(req.body.email);
        } catch (error) {
            console.log(error);
        }
    },
);

/**
 * @desc    Displays the reset page
 * @route   GET /reset/:token
 */
router.get("/reset/:token", async function(req, res){
    // See if there's a user with specified token and token expiration
    const foundUser = await req.app.locals.user.getUserByToken(
        req.params.token,
    );

    // if not, send back error code and redirect to /forgot
    if (!foundUser) {
        res.status(404);
        res.redirect("/forgot");
    } else {
        // Otherwise, render reset form
        res.sendFile(
            path.join(
                __dirname,
                "../../../Group-Project-CSCI-441-Frontend/reset.html",
            ),
        );
    }
});

/**
 * @desc    Resets the user's password in database
 * @route   POST /reset/:token
 */
router.post("/reset/:token", async function(req, res){
    // Checks database for token, unsets the token from user and update password
    const foundUser = (await req.app.locals.user.unsetTokenAndUpdatePassword(
        req.params.token,
        req.body.password,
    )).value;

    if (!foundUser) {
        // If token is invalid or expired, error back and jquery redirect
        res.sendStatus(408);
    } else {
        /**
         * Steps:
         *        1. In .env file, have the following environment variables
         *                        EMAILUSER=email
         *                        EMAILPW=password
         *        2. If using gmail, https://stackoverflow.com/a/44133190
         */

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAILUSER,
                pass: process.env.EMAILPW,
            },
        });

        let emailBody = `This is a confirmation that the password for ${foundUser.email} has been changed.`;

        // Send confirmation email
        await transporter.sendMail({
            from: `"Park n\' Go" <${process.env.EMAILUSER}>`, // sender address
            to: `${foundUser.email}`, // list of receivers
            subject: "Park n' Go Password Reset", // Subject line
            text: emailBody, // plain text body
        });

        // Send back success code, display success with jquery Ajax and redirect to login
        res.status(200);
        res.json(foundUser.email);
    }
});

/**
 * @desc    Serves the sign up page
 * @route   GET /signup
 */
// Sign Up Route
router.get([ "/signup", "/signup.html" ], function(req, res){
    if (req.isAuthenticated()) {
        res.redirect("/dashboard");
    }
    res.sendFile(
        path.join(
            __dirname,
            "../../../Group-Project-CSCI-441-Frontend/signup.html",
        ),
    );
});

/**
 * @desc    Create new user and handle sign up logic
 * @route   POST /signup
 */
router.post(
    "/signup",
    middleware.emailToLowerCase,
    middleware.userExists,
    function(req, res){
        // If the email is not in db, add the user and send back 201 status code + email
        req.app.locals.user.addUser(req.body);
        res.status(201);
        res.json(req.body.email);
    },
);

/**
 * @desc    Serves the dashboard page if user is authenticated
 * @route   GET /dashboard
 */
router.get([ "/dashboard", "/dashboard.html" ], function(req, res){
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    res.sendFile(
        path.join(
            __dirname,
            "../../../Group-Project-CSCI-441-Frontend/dashboard.html",
        ),
    );
});

/**
 * @desc    Serves the administrative page if user is authenticated
 * @route   GET /admin
 */
router.get([ "/admin", "/admin.html" ], function(req, res){
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    res.sendFile(
        path.join(
            __dirname,
            "../../../Group-Project-CSCI-441-Frontend/admin.html",
        ),
    );
});

/**
 * @desc    Serves the revenue report page if user is authenticated
 * @route   GET /revenue
 */
router.get([ "/revenue", "/rptRevenue.html" ], function(req, res){
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    res.sendFile(
        path.join(
            __dirname,
            "../../../Group-Project-CSCI-441-Frontend/rptRevenue.html",
        ),
    );
});

/**
 * @desc    Serves the dashboard page if user is authenticated
 * @route   GET /dashboard
 */
router.get([ "/reservation", "/reservation.html" ], function(req, res){
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    res.sendFile(
        path.join(
            __dirname,
            "../../../Group-Project-CSCI-441-Frontend/reservation.html",
        ),
    );
});

/**
 * @desc    Updates the user information in the database
 * @route   PUT /dashboard
 */
router.put(
    [ "/dashboard", "/dashboard.html" ],
    middleware.emailToLowerCase,
    middleware.userExists,
    async function(req, res){
        let updatedUser = await req.app.locals.user.updateUser(req.body);
        const { password, ...user } = updatedUser.value;
        res.json(user);
    },
);

/**
 * @desc    Logs the user out of the session
 * @route   GET /logout
 */
router.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/");
});

module.exports = router;
