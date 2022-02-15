// Models
const User = require('../models/user');
const Group = require('../models/group');
const Member = require('../models/member');

module.exports.index = async (req, res) => {
	const groups = await Group.find({ author: req.user._id }).sort('number');
	const user = await User.findOne({ _id: req.user._id });
	res.render('groups/index', { groups, user });
};

module.exports.getNew = (req, res) => {
	res.render('groups/new');
};

module.exports.postNew = async (req, res) => {
	const { number, lap, firstMemberChapter } = req.body.group;
	const group = new Group({ number, lap, firstMemberChapter });
	// Add group to author
	const author = await User.findById(req.user._id);
	author.groups.push(group);
	await author.save();
	// Add author to group
	group.author = author;
	// Add 60 member automatically to the group
	for (let i = 1; i <= 60; i++) {
		const mem = new Member({ number: i, group });
		await mem.save();
		group.members.push(mem);
	}
	await group.save();
	req.flash('success', 'تم إنشاء المجموعة بنجاح');
	res.redirect(`/groups/${group._id}`);
};

module.exports.getGroup = async (req, res) => {
	const { id } = req.params;
	const group = await Group.findById(id).populate('members');
	if (!group) {
		req.flash('error', 'المجموعة غير موجودة');
		return res.redirect('/groups');
	}
	res.render('groups/show', { group });
};

module.exports.getEditGroup = async (req, res) => {
	const { id } = req.params;
	const group = await Group.findById(id);
	if (!group) {
		req.flash('error', 'المجموعة غير موجودة');
		res.redirect('/groups');
	}
	res.render('groups/edit', { group });
};

module.exports.putEditGroup = async (req, res) => {
	const { id } = req.params;
	await Group.findByIdAndUpdate(id, req.body.group);
	req.flash('success', 'تم تعديل المجموعة بنجاح');
	res.redirect(`/groups/${id}`);
};

module.exports.deleteGroup = async (req, res) => {
	const { id } = req.params;
	await Group.findByIdAndDelete(id);
	req.flash('success', 'تم حذف المجموعة بنجاح');
	res.redirect(`/groups`);
};

module.exports.getGroupProgram = async (req, res) => {
	const { id } = req.params;
	const group = await Group.findById(id).populate('members');
	if (!group) {
		req.flash('error', 'المجموعة غير موجودة');
		return res.redirect('/groups');
	}
	res.render('groups/program', { group });
};
