const mongoose = require('mongoose');

const Staff = require('../models/staffModel');
const Covid = require('../models/covidInfoModel');

async function connect() {
  try {
    mongoose.connect(
      'mongodb+srv://thienthy:thienthy91@cluster0.ouuxj.mongodb.net/employee'
    );
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }
}

const staffs = [
  {
    name: 'Đoàn Thiện Thy',
    dOB: new Date(1991, 06, 03),
    salaryScale: 3,
    startDate: new Date(2022, 01, 01),
    department: 'IT',
    annualLeave: 14,
    image:
      'https://www.clipartmax.com/png/full/144-1442641_single-businessman-fashion-icon-business-man-icon-png.png',
    userName: 'manager',
    password: '12345',
    role: 'admin',
  },
  {
    name: 'Nguyễn Văn A',
    dOB: new Date(1995, 01, 01),
    salaryScale: 2,
    startDate: new Date(2022, 01, 01),
    department: 'IT',
    annualLeave: 14,
    image:
      'https://www.clipartmax.com/png/full/144-1442641_single-businessman-fashion-icon-business-man-icon-png.png',
    userName: 'staff',
    password: '12345',
    role: 'staff',
  },
  {
    name: 'Nguyễn Văn B',
    dOB: new Date(1995, 01, 01),
    salaryScale: 2,
    startDate: new Date(2022, 01, 01),
    department: 'IT',
    annualLeave: 14,
    image:
      'https://www.clipartmax.com/png/full/144-1442641_single-businessman-fashion-icon-business-man-icon-png.png',
    userName: 'staff1',
    password: '12345',
    role: 'staff',
  },
];

Staff.findOne()
  .then((staff) => {
    if (!staff) {
      //   const staff = new Staff({
      //     name: 'Đoàn Thiện Thy',
      //     dOB: new Date(1991, 06, 03),
      //     salaryScale: 3,
      //     startDate: new Date(2021, 01, 01),
      //     department: 'IT',
      //     annualLeave: 14,
      //     image:
      //       'https://www.clipartmax.com/png/full/144-1442641_single-businessman-fashion-icon-business-man-icon-png.png',
      //     userName: 'staff',
      //     password: '12345',
      //     role: 'staff',
      //   });
      //   staff.save();
      Staff.insertMany(staffs)
        .then(function () {
          console.log('Data inserted');
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  })
  .catch((error) => {
    console.log(error);
  });
module.exports = connect;
