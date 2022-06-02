const Staff = require('../models/staffModel');

// @desc    Display login form
// @route   GET /login
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: null,
  });
};

// @desc    Auth user & get cookie
// @route   POST /login
exports.postLogin = (req, res, next) => {
  const userName = req.body.userName;
  const password = req.body.password;

  Staff.findOne({ userName: userName })
    .then((staff) => {
      if (!staff) {
        return res.render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Tên đăng nhập hoặc mật khẩu không đúng',
        });
      }
      req.session.isLoggedIn = true;
      req.session.staff = staff;
      req.session.save((err) => {
        return res.redirect('/');
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// @desc    User logout
// @route   POST /logout
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
