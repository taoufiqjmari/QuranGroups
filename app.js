// Express
const express = require('express');
const app = express();
const port = 3000;

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
const ExperssError = require('./utils/ExpressError');

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
app.use('/groups', memberRouter);

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
