const fileHelper = require('../util/file');

// @desc    Get staff information
// @route   GET /infoStaff
exports.getInfoStaff = (req, res) => {
  res.render('staff/infoStaff', {
    path: '/infoStaff',
    pageTitle: 'Staff Info',
    staff: req.staff,
  });
};

// @desc    Edit staff picture
// @route   POST /infoStaff/edit
exports.postEditStaff = (req, res) => {
  const image = req.file;
  if (image) {
    fileHelper.deleteFile(req.staff.image);
    req.staff.image = image.path;
  }
  req.staff
    .save()
    .then(() => res.redirect('/infoStaff'))
    .catch((error) => console.log(error));
};
