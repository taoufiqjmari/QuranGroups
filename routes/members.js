// Express
const express = require('express');
const router = express.Router({ mergeParams: true });

// Models
// const Member = require('../models/member');

// Auth
const { isLoggedIn } = require('../utils/isLoggedIn');

// Errors
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// JOI
const { memberSchema } = require('../schemas');
const validateMember = (req, res, next) => {
    const { error } = memberSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else next();
};

// Controllers
const members = require('../controllers/members');

// Routes
router.route('/').put(isLoggedIn, validateMember, catchAsync(members.putEdit)).delete(isLoggedIn, catchAsync(members.delete));

router.get('/edit', isLoggedIn, catchAsync(members.getEdit));

module.exports = router;
