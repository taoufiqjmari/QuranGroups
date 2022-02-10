const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const GroupSchema = new Schema({
    number: {
        type: Number,
        min: [1, "Groups numbers can't be less than 1"],
        required: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Member',
            required: true,
        },
    ],
});

module.exports = model('Group', GroupSchema);
