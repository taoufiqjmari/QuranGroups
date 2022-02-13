const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group',
        },
    ],
});

UserSchema.plugin(passportLocalMongoose);

module.exports = model('User', UserSchema);
