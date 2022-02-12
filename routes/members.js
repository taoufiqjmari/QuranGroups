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
const Member = require('../models/member');

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
    '/:id/members/:member_id/edit',
    catchAsync(async (req, res) => {
        const { member_id } = req.params;
        const member = await Member.findById(member_id);
        res.render('members/edit', { member });
    })
);

router.put(
    '/:id/members/:member_id',
    validateMember,
    catchAsync(async (req, res) => {
        const { id, member_id } = req.params;
        const { name } = req.body.member;
        await Member.findByIdAndUpdate(member_id, { name });
        res.redirect(`/groups/${id}`);
    })
);

router.delete(
    '/:id/members/:member_id',
    catchAsync(async (req, res) => {
        const { id, member_id } = req.params;
        await Member.findByIdAndUpdate(member_id, { name: '/////' });
        res.redirect(`/groups/${id}`);
    })
);

module.exports = router;
