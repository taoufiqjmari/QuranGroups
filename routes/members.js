// Express
const express = require('express');
const router = express.Router({ mergeParams: true });

// Models
const Member = require('../models/member');

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
    } else {
        next();
    }
};

// Routes
router.get(
    '/edit',
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { member_id } = req.params;
        const member = await Member.findById(member_id);
        res.render('members/edit', { member });
    })
);

router.put(
    '/',
    isLoggedIn,
    validateMember,
    catchAsync(async (req, res) => {
        const { id, member_id } = req.params;
        const { name } = req.body.member;
        await Member.findByIdAndUpdate(member_id, { name });
        req.flash('success', 'تم تعديل القارئ بنجاح');
        res.redirect(`/groups/${id}`);
    })
);

router.delete(
    '/',
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { id, member_id } = req.params;
        await Member.findByIdAndUpdate(member_id, { name: '/////' });
        req.flash('success', 'تم حذف القارئ بنجاح');
        res.redirect(`/groups/${id}`);
    })
);

module.exports = router;
