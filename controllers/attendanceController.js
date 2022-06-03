const Staff = require('../models/staffModel');
const Attendance = require('../models/attendanceModel');
const AnnualLeave = require('../models/annualLeaveModel');
const Manager = require('../models/managerModel');

// @desc    Display index page of attendance
// @route   GET /attendance
exports.getIndex = async (req, res) => {
  const manager = await Manager.find(req.session.staff._id);
  const presentMonth = new Date().getMonth() + 1;

  // Filter to get confirm month
  const monthConfirmed = manager.filter((item) => {
    return item.month === presentMonth;
  });
  let confirmed;
  // Check confirm month == present month
  if (monthConfirmed[0]?.month == presentMonth) {
    confirmed = true;
  } else {
    confirmed = false;
  }
  res.render('attendance/index', {
    pageTitle: 'Attendance',
    path: '/attendance',
    confirmed,
  });
};

// @desc    Display start page
// @route   GET /attendance/start
exports.getStartWork = (req, res) => {
  res.render('attendance/startWork', {
    path: '/attendance',
    pageTitle: 'Start Work',
    staff: req.staff,
  });
};

// @desc    Create and update info of start work
// @route   POST /attendance/start
exports.postStartWork = async (req, res) => {
  const staff = await Staff.findById(req.session.staff._id);
  // Get present date
  const newStartDay = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const startWork = new Attendance({
    name: req.body.name,
    staffId: staff._id,
    workTimes: [
      {
        startTime: new Date(),
        endTime: new Date(),
        workPlace: req.body.workPlace,
        working: true,
        timeWorked: 0,
      },
    ],
    overTime: null,
    totalWorkHours: null,
  });

  // Check attendance collection whether it exits and newstartDay = dayWork
  Attendance.find({ date: newStartDay, staffId: staff._id }).then(
    (attendance) => {
      // Find last start work
      const newAttendance = attendance[attendance.length - 1];

      // If yes, push data newStartWork to collection
      if (newAttendance) {
        const newStartWork = {
          startTime: new Date(),
          endTime: new Date(),
          workPlace: req.body.workPlace,
          working: true,
          timeWorked: 0,
        };
        newAttendance.workTimes.push(newStartWork);
        newAttendance
          .save()
          .then((result) => {
            res.redirect('/attendance/workingInfo');
          })
          .catch((error) => {
            console.log(error);
          });
      }
      // If not, create new attendance collection
      else {
        startWork
          .save()
          .then((result) => {
            res.redirect('/attendance/workingInfo');
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  );
};

// @desc    Display information of start work
// @route   POST /attendance/workingInfo
exports.getInfoStart = (req, res) => {
  Attendance.find()
    .then((attendance) => {
      const newAttendance = attendance[attendance.length - 1];
      res.render('attendance/workingInfo', {
        path: '/attendance/workingInfo',
        pageTitle: 'Working',
        attendance: newAttendance,
        startWork: newAttendance.workTimes[newAttendance.workTimes.length - 1],
      });
    })
    .catch((err) => console.log(err));
};

// @desc    Update information of end work
// @route   POST /attendance/end
exports.postEndWork = (req, res) => {
  // Caculate hours distance from endTime to startTime
  const hoursDistance = (date1, date2) => {
    let distance = Math.abs(date1 - date2);
    const hours = Math.floor(distance / 3600000);
    distance -= hours * 3600000;
    return hours;
  };

  const newEndTime = new Date();

  Attendance.find()
    .then((attendance) => {
      // Find last attendance from collection
      const endWork = attendance[attendance.length - 1];
      // Find last workTimes from last attendance
      const lastStartWork = endWork.workTimes[endWork.workTimes.length - 1];

      if (lastStartWork.working === true) {
        const startTime = lastStartWork.startTime.getTime();
        const endTime = newEndTime.getTime();
        const timeWorked = hoursDistance(endTime, startTime);

        // Save to database
        lastStartWork.endTime = newEndTime;
        lastStartWork.working = false;
        lastStartWork.timeWorked = timeWorked;

        // Filter to eliminate null value
        const notNull = endWork.workTimes.filter(
          (item) => item.timeWorked !== 0
        );

        // Caculate totalWorkHours
        const timeWorkInDay = notNull.reduce((prev, item) => {
          return prev + item.timeWorked;
        }, 0);

        const overTime = timeWorkInDay - 8 < 0 ? 0 : timeWorkInDay - 8;
        const totalWorkHours = timeWorkInDay - 8 >= 0 ? 8 : timeWorkInDay;

        // Save to database
        endWork.overTime = overTime;
        endWork.totalWorkHours = totalWorkHours;

        return endWork.save();
      }
    })
    .then((result) => {
      res.redirect('/attendance/endWork');
    })
    .catch((err) => console.log(err));
};

// @desc    Display information of start work
// @route   GET /attendance/endWork
exports.getInfoEnd = (req, res) => {
  Attendance.find()
    .then((attendance) => {
      const lastEndWork = attendance[attendance.length - 1];
      res.render('attendance/endWork', {
        path: '/attendance/endWork',
        pageTitle: 'End Work',
        attendance: lastEndWork,
      });
    })
    .catch((err) => console.log(err));
};

// @desc    Display annual leave regist form
// @route   GET /attendance/annualLeave
exports.getAnnualLeaveRegister = (req, res) => {
  Staff.findById(req.session.staff._id)
    .then((staff) => {
      res.render('attendance/annualLeave', {
        path: '/attendance',
        pageTitle: 'Annual Leave Registry',
        staff: staff,
      });
    })
    .catch((err) => console.log(err));
};

// @desc    Regist data of annual leave
// @route   POST /attendance/leaveForm
exports.postAnnualLeaveRegister = async (req, res) => {
  const staff = await Staff.findById(req.session.staff._id);

  // Caculate number of daysLeave
  const daysLeave = req.body.daysLeave;
  const singleDayLeave = daysLeave.split('-');
  const daystart = singleDayLeave[0];
  const dayEnd = singleDayLeave[1];
  const numberOfDaysLeave =
    new Date(dayEnd).getDate() - new Date(daystart).getDate() + 1;

  // Caculate remain annualLeave
  const daysLeft = Number(req.body.daysLeft);
  const hoursRequested = Number(req.body.hoursLeave);
  const daysUsed = numberOfDaysLeave * (hoursRequested / 8);
  const remainAnnualLeave = daysLeft - daysUsed;

  const annualLeave = new AnnualLeave({
    name: staff.name,
    staffId: staff._id,
    daysLeave: daysLeave,
    numberOfDaysLeave: numberOfDaysLeave,
    hoursRequested: hoursRequested,
    daysUsed: daysUsed,
    reason: req.body.reason,
  });
  annualLeave.save();
  req.staff.annualLeave = remainAnnualLeave;
  req.staff
    .save()
    .then((result) => {
      res.redirect('/attendance');
    })
    .catch((err) => {
      console.log(err);
    });
};
