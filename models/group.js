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

const Member = require('./member');
GroupSchema.post('findOneAndDelete', async function (group) {
    await Member.deleteMany({ _id: { $in: group.members } });
});

module.exports = model('Group', GroupSchema);
