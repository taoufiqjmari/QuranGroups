// mongoose
const mongoose = require('mongoose');
const group = require('../models/group');
main().catch((err) => console.log(err));
async function main() {
    const db = 'quran-groups';
    await mongoose.connect(`mongodb://localhost:27017/${db}`);
    console.log(`MongoDB: connected to '${db}' successfuly`);
}
const Group = require('../models/group');

// data
const data = require('./data');

const seedDB = async () => {
    await Group.deleteMany({});
    for (datum of data) {
        const group = new Group(datum);
        await group.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
