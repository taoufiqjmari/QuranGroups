// Models
const User = require('../models/user');

module.exports.getRegister = (req, res) => {
    res.render('users/register');
};

module.exports.postRegister = async (req, res, next) => {
    try {
        const { username, email, password } = req.body.user;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'مرحبا!');
            res.redirect('/groups');
        });
    } catch (err) {
        if (err.message === 'A user with the given username is already registered') {
            req.flash('error', 'يوجد مستخدم بنفس الاسم، اختر اسما آخر');
        } else {
            req.flash('error', 'يوجد مستخدم بنفس البريد الالكتروني، اختر بريدا الكتونيا آخر');
        }
        res.redirect('register');
    }
};

module.exports.getLogin = (req, res) => {
    res.render('users/login');
};

module.exports.postLogin = async (req, res) => {
    req.flash('success', 'مرحبا!');
    const redirectUrl = req.session.returnTo || '/groups';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.delete = (req, res) => {
    req.logout();
    req.flash('success', 'وداعا');
    res.redirect('/login');
};
