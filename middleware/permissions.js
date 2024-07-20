// middleware/auth.js

const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    } else {
        res.render('user-dashboard');
    }
};

const authentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};

module.exports = {
    isAdmin,
    authentication
};