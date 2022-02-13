// Models
const Member = require('../models/member');

module.exports.getEdit = async (req, res) => {
    const { member_id } = req.params;
    const member = await Member.findById(member_id);
    res.render('members/edit', { member });
};

module.exports.putEdit = async (req, res) => {
    const { id, member_id } = req.params;
    const { name } = req.body.member;
    await Member.findByIdAndUpdate(member_id, { name });
    req.flash('success', 'تم تعديل القارئ بنجاح');
    res.redirect(`/groups/${id}`);
};

module.exports.delete = async (req, res) => {
    const { id, member_id } = req.params;
    await Member.findByIdAndUpdate(member_id, { name: '/////' });
    req.flash('success', 'تم حذف القارئ بنجاح');
    res.redirect(`/groups/${id}`);
};
