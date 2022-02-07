const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const GroupSchema = new Schema({
    num: {
        type: Number,
        min: [0, "Groups numbers can't be less than 0"],
        required: true,
    },
});

module.exports = model('Group', GroupSchema);
