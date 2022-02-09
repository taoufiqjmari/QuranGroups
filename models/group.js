const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const GroupSchema = new Schema({
    num: {
        type: Number,
        min: [1, "Groups numbers can't be less than 1"],
        required: true,
    },
});

module.exports = model('Group', GroupSchema);
