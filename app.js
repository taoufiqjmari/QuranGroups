// Express
const express = require('express');
const app = express();
const port = 3000;

// mongoose
const mongoose = require('mongoose');
main().catch((err) => console.log(err));
async function main() {
    const db = 'quran-groups';
    await mongoose.connect(`mongodb://localhost:27017/${db}`);
    console.log(`MongoDB: connected to '${db}' successfuly`);
}
const Group = require('./models/group');
const Member = require('./models/member');

// EJS
const path = require('path');
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Parssing requests
app.use(express.urlencoded({ extended: true }));

// HTTP methods
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Errors
const catchAsync = require('./utils/catchAsync');
const ExperssError = require('./utils/ExpressError');
const ExpressError = require('./utils/ExpressError');

// JOI
const { groupSchema, memberSchema } = require('./schemas');
const validateGroup = (req, res, next) => {
    const { error } = groupSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
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
app.get('/', (req, res) => {
    res.redirect('/groups');
});

// Groups
app.get(
    '/groups',
    catchAsync(async (req, res) => {
        const groups = await Group.find().sort('number');
        res.render('groups/index', { groups });
    })
);

app.get('/groups/new', (req, res) => {
    res.render('groups/new');
});

app.post(
    '/groups',
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

app.get(
    '/groups/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const group = await Group.findById(id).populate('members');
        res.render('groups/show', { group });
    })
);

app.get(
    '/groups/:id/edit',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const group = await Group.findById(id);
        res.render('groups/edit', { group });
    })
);

app.put(
    '/groups/:id',
    validateGroup,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Group.findByIdAndUpdate(id, req.body.group);
        res.redirect(`/groups/${id}`);
    })
);

app.delete(
    '/groups/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Group.findByIdAndDelete(id);
        res.redirect(`/groups`);
    })
);

// Members
app.get(
    '/groups/:id/members/:member_id/edit',
    catchAsync(async (req, res) => {
        const { member_id } = req.params;
        const member = await Member.findById(member_id);
        res.render('members/edit', { member });
    })
);

app.put(
    '/groups/:id/members/:member_id',
    validateMember,
    catchAsync(async (req, res) => {
        const { id, member_id } = req.params;
        const { name } = req.body.member;
        await Member.findByIdAndUpdate(member_id, { name });
        res.redirect(`/groups/${id}`);
    })
);

app.delete(
    '/groups/:id/members/:member_id',
    catchAsync(async (req, res) => {
        const { id, member_id } = req.params;
        await Member.findByIdAndUpdate(member_id, { name: '/////' });
        res.redirect(`/groups/${id}`);
    })
);

app.all('*', (req, res, next) => {
    next(new ExperssError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong';
    res.status(statusCode).render('error', { err });
});

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});
