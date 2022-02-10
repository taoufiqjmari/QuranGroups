const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const MemberSchema = new Schema({
    number: {
        type: Number,
        required: true,
        min: [1, "Members numbers can't be less than 1"],
        max: [60, "Members numbers can't be greater than 1"],
    },
    name: {
        type: String,
        required: true,
        default: '/////',
        trim: true,
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
});

module.exports = model('Member', MemberSchema);
