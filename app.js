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

// EJS
const path = require('path');
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));
// /groups             http://localhost:3000/css/style.css
// /gourps/            http://localhost:3000/groups/css/style.css
// /groups/new         http://localhost:3000/groups/css/style.css
// /groups/:id/edit    http://localhost:3000/groups/:id/css/style.css

// Parssing requests
app.use(express.urlencoded({ extended: true }));

// HTTP methods
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/groups', async (req, res) => {
    const groups = await Group.find();
    res.render('groups/index', { groups });
});

app.get('/groups/new', (req, res) => {
    res.render('groups/new');
});

app.post('/groups', async (req, res) => {
    const group = new Group(req.body);
    await group.save();
    res.redirect(`/groups/${group._id}`);
});

app.get('/groups/:id', async (req, res) => {
    const { id } = req.params;
    const group = await Group.findById(id);
    res.render('groups/show', { group });
});

app.get('/groups/:id/edit', async (req, res) => {
    const { id } = req.params;
    const group = await Group.findById(id);
    res.render('groups/edit', { group });
});

app.put('/groups/:id', async (req, res) => {
    const { id } = req.params;
    const group = await Group.findByIdAndUpdate(id, req.body);
    res.redirect(`/groups/${group._id}`);
});

app.delete('/groups/:id', async (req, res) => {
    const { id } = req.params;
    await Group.findByIdAndDelete(id);
    res.redirect(`/groups`);
});

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});
