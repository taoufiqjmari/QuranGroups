// mongoose
const mongoose = require('mongoose');
main().catch((err) => console.log(err));
async function main() {
    const db = 'quran-groups';
    await mongoose.connect(`mongodb://localhost:27017/${db}`);
    console.log(`MongoDB: connected to '${db}' successfuly`);
}

// Models
const User = require('../models/user');
const Group = require('../models/group');
const Member = require('../models/member');

// Data
const { groups, members } = require('./data');

// Logic
const seedDB = async () => {
    // Clear collections
    await User.deleteMany({});
    await Group.deleteMany({});
    await Member.deleteMany({});
    // Fill collections with new data
    // for (group of groups) {
    //     const gr = new Group(group);
    //     for (member of members) {
    //         const mem = new Member(member);
    //         mem.group = gr;
    //         await mem.save();
    //         gr.members.push(mem);
    //     }
    //     await gr.save();
    // }
};

// Execution
seedDB().then(() => {
    mongoose.connection.close();
});
