// .env
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// mongoose
const dbName = 'quran-groups';
const dbUrl = process.env.DB_URL || `mongodb://localhost:27017/${dbName}`;
const mongoose = require('mongoose');
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
    console.log(`MongoDB: connected to '${dbName}' successfuly`);
}
// Models
const User = require('./models/user');

// Security
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

// Session
const session = require('express-session');

const MongoStore = require('connect-mongo');
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SECRET || 'thisisabadsecret',
    },
});
store.on('error', function (err) {
    console.log('Session store error', err);
});

app.use(
    session({
        store,
        name: 'isIn',
        secret: process.env.SECRET || 'thisisabadsecret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            // secure: true,
            expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    })
);

// Passport
const passport = require('passport');
const localStrategy = require('passport-local');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash
const flash = require('connect-flash');
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // To check whether user is logged in or not on navbar
    res.locals.currentUser = req.user;
    next();
});

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
const ExpressError = require('./utils/ExpressError');

// Routes
// Default
app.get('/', (req, res) => {
    res.redirect('/groups');
});

// Users
const usersRouter = require('./routes/users');
app.use('/', usersRouter);

// Groups
const groupsRouter = require('./routes/groups');
app.use('/groups', groupsRouter);

// Members
const membersRouter = require('./routes/members');
app.use('/groups/:id/members/:member_id', membersRouter);

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
    console.log(`Example app listening on port ${port}`);
});
