const Group = require('./models/group');

module.exports.incrementLapChapters = async function () {
	const update = {
		$inc: {
			lap: 1,
			firstMemberChapter: 1,
		},
	};
	await Group.updateMany({}, update);
};
