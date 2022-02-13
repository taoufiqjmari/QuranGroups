// Express
const express = require('express');
const router = express.Router();

// Models
const Group = require('../models/group');
const Member = require('../models/member');

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
    } else {
        next();
    }
};

// Routes
router.get(
    '/',
    isLoggedIn,
    catchAsync(async (req, res) => {
        const groups = await Group.find().sort('number');
        res.render('groups/index', { groups });
    })
);

router.get('/new', isLoggedIn, (req, res) => {
    res.render('groups/new');
});

router.post(
    '/',
    isLoggedIn,
    validateGroup,
    catchAsync(async (req, res) => {
        const { number } = req.body.group;
        const group = new Group({ number });
        // Add 60 member automatically to the group
        for (let i = 1; i <= 60; i++) {
            const mem = new Member({ number: i, group });
            await mem.save();
            group.members.push(mem);
        }
        await group.save();
        req.flash('success', 'تم إنشاء المجموعة بنجاح');
        res.redirect(`/groups/${group._id}`);
    })
);

router.get(
    '/:id',
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const group = await Group.findById(id).populate('members');
        if (!group) {
            req.flash('error', 'المجموعة غير موجودة');
            return res.redirect('/groups');
        }
        res.render('groups/show', { group });
    })
);

router.get(
    '/:id/edit',
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const group = await Group.findById(id);
        if (!group) {
            req.flash('error', 'المجموعة غير موجودة');
            res.redirect('/groups');
        }
        res.render('groups/edit', { group });
    })
);

router.put(
    '/:id',
    isLoggedIn,
    validateGroup,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Group.findByIdAndUpdate(id, req.body.group);
        req.flash('success', 'تم تعديل المجموعة بنجاح');
        res.redirect(`/groups/${id}`);
    })
);

router.delete(
    '/:id',
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Group.findByIdAndDelete(id);
        req.flash('success', 'تم حذف المجموعة بنجاح');
        res.redirect(`/groups`);
    })
);

module.exports = router;
