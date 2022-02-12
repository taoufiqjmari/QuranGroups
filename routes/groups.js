// Express
const express = require('express');
const router = express.Router();

// mongoose
const mongoose = require('mongoose');
main().catch((err) => console.log(err));
async function main() {
    const db = 'quran-groups';
    await mongoose.connect(`mongodb://localhost:27017/${db}`);
    console.log(`MongoDB: connected to '${db}' successfuly`);
}
const Group = require('../models/group');
const Member = require('../models/member');

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
    catchAsync(async (req, res) => {
        const groups = await Group.find().sort('number');
        res.render('groups/index', { groups });
    })
);

router.get('/new', (req, res) => {
    res.render('groups/new');
});

router.post(
    '/',
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
        res.redirect(`/groups/${group._id}`);
    })
);

router.get(
    '/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const group = await Group.findById(id).populate('members');
        res.render('groups/show', { group });
    })
);

router.get(
    '/:id/edit',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const group = await Group.findById(id);
        res.render('groups/edit', { group });
    })
);

router.put(
    '/:id',
    validateGroup,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Group.findByIdAndUpdate(id, req.body.group);
        res.redirect(`/groups/${id}`);
    })
);

router.delete(
    '/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Group.findByIdAndDelete(id);
        res.redirect(`/groups`);
    })
);

module.exports = router;
