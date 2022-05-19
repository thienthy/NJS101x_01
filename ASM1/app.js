const path = require('path');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Staff = require('./models/staffModel');
const Covid = require('./models/covidInfoModel');

const homeRoutes = require('./routes/homeRoute');
const attendanceRoutes = require('./routes/attendanceRoute');
const errorController = require('./controllers/errorController');
const staffController = require('./routes/staffRoute');
const workTimeController = require('./routes/workTimeRoute');
const covidInfoController = require('./routes/covidInfoRoute');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  Staff.find()
    .then((staff) => {
      req.staff = staff[0];
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/attendance', attendanceRoutes);
app.use(staffController);
app.use(homeRoutes);
app.use('/workTime', workTimeController);
app.use('/covid', covidInfoController);
app.use(errorController.get404);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    'mongodb+srv://thienthy:thienthy91@cluster0.ouuxj.mongodb.net/employee?retryWrites=true&w=majority'
  )
  .then((result) => {
    Staff.findOne().then((staff) => {
      if (!staff) {
        const staff = new Staff({
          name: 'Đoàn Thiện Thy',
          dOB: new Date(1991, 06, 03),
          salaryScale: 3,
          startDate: new Date(2021, 01, 01),
          department: 'IT',
          annualLeave: 14,
          image:
            'https://www.clipartmax.com/png/full/144-1442641_single-businessman-fashion-icon-business-man-icon-png.png',
        });
        staff.save();
      }
    });
    Covid.findOne().then((covid) => {
      if (!covid) {
        const covid = new Covid({
          bodyTemperature: [],
          vaccineInfo: [],
          infectionCovidInfo: [],
        });
        covid.save();
      }
    });
    app.listen(PORT, () => {
      console.log(`Server at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
