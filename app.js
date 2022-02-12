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

// Session
const session = require('express-session');
app.use(
    session({
        secret: 'thisisasecret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    })
);

// Flash
const flash = require('connect-flash');
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Errors
const ExpressError = require('./utils/ExpressError');

// Routes
// Default
app.get('/', (req, res) => {
    res.redirect('/groups');
});

// Groups
const groupsRouter = require('./routes/groups');
app.use('/groups', groupsRouter);

// Members
const memberRouter = require('./routes/members');
app.use('/groups/:id/members/:member_id', memberRouter);

// Others
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong';
    res.status(statusCode).render('error', { err });
});

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});
