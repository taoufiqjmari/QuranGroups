// Express
const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });

// Models
// const User = require('../models/user');

// Auth
const { isLoggedIn } = require('../utils/isLoggedIn');

// Errors
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// JOI
const { userSchema } = require('../schemas');
const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else next();
};

// Controllers
const users = require('../controllers/users');

// Routes
router.route('/register').get(isLoggedIn, users.getRegister).post(isLoggedIn, validateUser, catchAsync(users.postRegister));

router
    .route('/login')
    .get(isLoggedIn, users.getLogin)
    .post(isLoggedIn, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(users.postLogin));

router.get('/logout', isLoggedIn, users.delete);

module.exports = router;
