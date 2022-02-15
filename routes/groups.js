// Express
const express = require('express');
const router = express.Router();

// Models
// const User = require('../models/user');
// const Group = require('../models/group');
// const Member = require('../models/member');

// Auth
const { isLoggedIn } = require('../utils/isLoggedIn');

// Errors
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// JOI
const { groupSchema } = require('../schemas');
const validateGroup = (req, res, next) => {
	const { error } = groupSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else next();
};

// Controllers
const groups = require('../controllers/groups');

// Routes
router.route('/').get(isLoggedIn, catchAsync(groups.index)).post(isLoggedIn, validateGroup, catchAsync(groups.postNew));

router.get('/new', isLoggedIn, groups.getNew);

router
	.route('/:id')
	.get(isLoggedIn, catchAsync(groups.getGroup))
	.put(isLoggedIn, validateGroup, catchAsync(groups.putEditGroup))
	.delete(isLoggedIn, catchAsync(groups.deleteGroup));

router.get('/:id/edit', isLoggedIn, catchAsync(groups.getEditGroup));

router.get('/:id/program', isLoggedIn, catchAsync(groups.getGroupProgram));

module.exports = router;
