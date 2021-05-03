const middlewareObj = {};

middlewareObj.userExists = async function(req, res, next){
    // User is logged in and sent a PUT request to /dashboard to update
    if (
        req.isAuthenticated() &&
        (req.body.email === req.user.email || req.body.adminUpdate == 1)
    ) {
        return next(); // no need to check db, user did not change their email
    }

    // Otherwise, check db to see if there's already an account registered with the provided email
    const userExist = (await req.app.locals.user.getUserByEmail(req.body.email))
        ? true
        : false;

    if (userExist) {
        // If so, send back 403 status code
        res.status(403);
        res.json(req.body.email);
    } else {
        return next();
    }
};

middlewareObj.emailToLowerCase = (req, res, next) => {
    req.body.email = req.body.email.toLowerCase();
    return next();
};

module.exports = middlewareObj;
