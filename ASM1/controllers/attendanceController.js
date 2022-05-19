const Staff = require('../models/staffModel');
const Attendance = require('../models/attendanceModel');
const AnnualLeave = require('../models/annualLeaveModel');

// @desc    Display index page of attendance
// @route   GET /attendance
exports.getIndex = (req, res) => {
  res.render('attendance/index', {
    pageTitle: 'Attendance',
    path: '/attendance',
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
exports.postStartWork = (req, res) => {
  const newStartDay = new Date().getDate();
  Attendance.find().then((attendance) => {
    const startWork = new Attendance({
      name: req.body.name,
      workTimes: [
        {
          startTime: new Date(),
          endTime: null,
          workPlace: req.body.workPlace,
          working: true,
          timeWorked: 0,
        },
      ],
      overTime: null,
      totalWorkHours: null,
    });
    const newAttendance = attendance[attendance.length - 1];

    // Check attendance collection whether it exits and newstartDay = dayWork
    // If yes, push newStartWork to collection
    // If not, create new attendance colection
    if (newAttendance) {
      const dayWork = newAttendance.date.getDate();
      if (newStartDay === dayWork) {
        const newStartWork = {
          startTime: new Date(),
          endTime: null,
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
      } else {
        startWork
          .save()
          .then((result) => {
            res.redirect('/attendance/workingInfo');
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      startWork
        .save()
        .then((result) => {
          res.redirect('/attendance/workingInfo');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
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

      if (lastStartWork.endTime === null) {
        const startTime = lastStartWork.startTime.getTime();
        const endTime = newEndTime.getTime();
        const timeWorked = hoursDistance(endTime, startTime);

        lastStartWork.endTime = newEndTime;
        lastStartWork.working = false;
        lastStartWork.timeWorked = timeWorked;

        // Filter to eliminate null value
        const notNull = endWork.workTimes.filter(
          (item) => item.timeWorked !== 0
        );
        const totalWorkHours = notNull.reduce((prev, item) => {
          return prev + item.timeWorked;
        }, 0);

        const overTime = totalWorkHours - 8 < 0 ? 0 : totalWorkHours - 8;

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
  Staff.find({})
    .then((staff) => {
      res.render('attendance/annualLeave', {
        path: '/attendance',
        pageTitle: 'Annual Leave Registry',
        staff: staff[0],
      });
    })
    .catch((err) => console.log(err));
};

// @desc    Regist data of annual leave
// @route   POST /attendance/leaveForm
exports.postAnnualLeaveRegister = (req, res) => {
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
    daysLeave: daysLeave,
    numberOfDaysLeave: numberOfDaysLeave,
    hoursRequested: hoursRequested,
    daysUsed: daysUsed,
    reason: req.body.reason,
  });
  annualLeave.save();
  Staff.findOne()
    .then((staff) => {
      staff.annualLeave = remainAnnualLeave;
      return staff.save();
    })
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};
