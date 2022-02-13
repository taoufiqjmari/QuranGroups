module.exports.isLoggedIn = (req, res, next) => {
    const forIn = ['/login', '/register'];
    const forOut = ['/logout'];
    if (req.isAuthenticated() && forIn.includes(req.originalUrl)) return res.redirect('/groups');
    else if (!req.isAuthenticated() && forOut.includes(req.originalUrl)) return res.redirect('/login');
    else if (!req.isAuthenticated() && !forIn.includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl; // To know what path the user is coming from
        req.flash('error', 'يجب عليك تسجيل الدخول أو إنشاء حساب إن لم تنشأ واحدا بعد');
        return res.redirect('/login');
    } else next();
};
