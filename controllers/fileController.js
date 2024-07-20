
const getfiles = (req, res) => {
    res.render('admin-dashboard', { user: req.user })
};

module.exports = {
    getfiles
}