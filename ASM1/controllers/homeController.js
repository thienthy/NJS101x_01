// @desc    Get home page
// @route   GET /
exports.getIndex = (req, res) => {
  res.render('home', {
    path: '/',
    pageTitle: 'Home',
  });
};
