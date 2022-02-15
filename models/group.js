const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const GroupSchema = new Schema({
	number: {
		type: Number,
		min: [1, "Groups numbers can't be less than 1"],
		required: true,
	},
	lap: {
		type: Number,
		min: [1, "Groups numbers can't be less than 1"],
		required: true,
	},
	firstMemberChapter: {
		type: Number,
		min: [1, "Groups numbers can't be less than 1"],
		required: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
		},
	],
	header: {
		type: String,
	},
	footer: {
		type: String,
	},
});

const User = require('./user');
const Member = require('./member');
GroupSchema.post('findOneAndDelete', async function (group) {
	// Delete the 50 members of the group after deleting the group
	await Member.deleteMany({ _id: { $in: group.members } });
	// Delete the group from user
	const filter = { _id: group.author };
	const update = { $pull: { groups: group._id } };
	await User.findOneAndUpdate(filter, update, { new: true });
});

module.exports = model('Group', GroupSchema);
