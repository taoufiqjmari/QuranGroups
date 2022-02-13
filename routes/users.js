// Express
const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });

// Models
const User = require('../models/user');

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

// Routes
router.get('/register', isLoggedIn, (req, res) => {
    res.render('users/register');
});

router.post(
    '/register',
    isLoggedIn,
    validateUser,
    catchAsync(async (req, res, next) => {
        try {
            const { username, email, password } = req.body.user;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, (err) => {
                if (err) return next(err);
                req.flash('success', 'مرحبا!');
                res.redirect('/groups');
            });
        } catch (err) {
            if (err.message === 'A user with the given username is already registered') {
                req.flash('error', 'يوجد مستخدم بنفس الاسم، اختر اسما آخر');
            } else {
                req.flash('error', 'يوجد مستخدم بنفس البريد الالكتروني، اختر بريدا الكتونيا آخر');
            }
            res.redirect('register');
        }
    })
);

router.get('/login', isLoggedIn, (req, res) => {
    res.render('users/login');
});

router.post(
    '/login',
    isLoggedIn,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    catchAsync(async (req, res) => {
        req.flash('success', 'مرحبا!');
        const redirectUrl = req.session.returnTo || '/groups';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    })
);

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.flash('success', 'وداعا');
    res.redirect('/login');
});

module.exports = router;
