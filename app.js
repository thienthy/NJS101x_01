const path = require('path');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const db = require('./config/db');
const Staff = require('./models/staffModel');

const homeRoutes = require('./routes/homeRoute');
const attendanceRoutes = require('./routes/attendanceRoute');
const errorController = require('./controllers/errorController');
const staffRoutes = require('./routes/staffRoute');
const workTimeRoutes = require('./routes/workTimeRoute');
const covidInfoRoutes = require('./routes/covidInfoRoute');
const authRoutes = require('./routes/authRoute');
const manageStaffRoutes = require('./routes/manageStaffRoute');

const MONGODB_URI =
  'mongodb+srv://thienthy:thienthy91@cluster0.ouuxj.mongodb.net/employee';

// Connect to MongoDB
db();

// Parse body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// View Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Create FileStorage for Images
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().slice(0, 13) + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image.jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Set static: public
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Save session
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Token
const csrfProtection = csrf();
app.use(csrfProtection);

// Connect-flash
app.use(flash());

// Set token, authenticated
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Add staff in request
app.use((req, res, next) => {
  if (!req.session.staff) {
    res.locals.role = false;
    return next();
  }
  Staff.findById(req.session.staff._id)
    .then((staff) => {
      if (!staff) {
        return next();
      }
      req.staff = staff;
      if (staff.role === 'admin') {
        res.locals.role = 'admin';
        return next();
      }
      res.locals.role = 'staff';
      next();
    })
    .catch((err) => console.log(err));
});

app.use(homeRoutes);
app.use('/attendance', attendanceRoutes);
app.use(staffRoutes);
app.use('/workTime', workTimeRoutes);
app.use('/covid', covidInfoRoutes);
app.use('/manageStaff', manageStaffRoutes);
app.use(authRoutes);
app.use(errorController.get404);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server at http://localhost:${PORT}`);
});
