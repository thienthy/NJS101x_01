const Staff = require('../models/staffModel');
const Attendance = require('../models/attendanceModel');
const AnnualLeave = require('../models/annualLeaveModel');
const Salary = require('../models/salaryModel');

// @desc    Display index page of workTime
// @route   GET /workTime
exports.getIndexWorkTime = (req, res) => {
  res.render('workTime/indexWorkTime', {
    pageTitle: 'Work Time',
    path: '/workTime',
  });
};

// @desc    Display information of workTime page record
// @route   GET /workTime/work
exports.getWorkTimeRecord = (req, res) => {
  Attendance.find({})
    .then((attendance) => {
      res.render('workTime/workTimeRecord', {
        path: '/workTime/work',
        pageTitle: 'Work Time Record',
        attendance: attendance,
      });
    })
    .catch((err) => console.log(err));
};

// @desc    Display information of annualLeave page record
// @route   GET /workTime/annualLeave
exports.getAnnualLeaveRecord = (req, res) => {
  AnnualLeave.find({})
    .then((annualLeave) => {
      res.render('workTime/annualLeaveRecord', {
        path: '/workTime/annualLeave',
        pageTitle: 'Annual Leave Record',
        annualLeave: annualLeave,
      });
    })
    .catch((err) => console.log(err));
};

// @desc    Select month to caculate salary
// @route   POST /workTime/getSalary
exports.postSalary = async (req, res) => {
  const annualLeave = await AnnualLeave.find();
  const attendance = await Attendance.find();

  Staff.findOne()
    .then((staff) => {
      const totalOverTime = attendance.reduce((prev, item) => {
        return prev + item.overTime;
      }, 0);

      const year = 2022;
      const month = req.body.month;
      // Find last day of each month
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const listDayLeave = [];
      let shortTime = 0;

      // Get start day, end date, and month of annualLeave
      annualLeave.forEach((leaveInfo) => {
        const listDay = leaveInfo.daysLeave.split('-');
        const dayLeave = {};

        const dayStartLeave = new Date(listDay[0]);
        const dayEndLeave = new Date(listDay[1]);
        const timesLeave = leaveInfo.hoursRequested;

        dayLeave.dayStartLeave = dayStartLeave.getDate();
        dayLeave.dayEndLeave = dayEndLeave.getDate();
        dayLeave.monthLeave = dayStartLeave.getMonth();
        dayLeave.timesLeave = timesLeave;
        return listDayLeave.push(dayLeave);
      });

      // Loop all day in each month to find timeWorkInDay and annualLeave in order to caculate shortTime
      for (let i = 1; i <= lastDayOfMonth; i++) {
        // Set default timeWorkInDay
        let timeWorkInDay = 8;
        let timeAnnualLeave = 0;

        // Loop all annualLeave to find this month have annualLeave or not
        listDayLeave.forEach((day) => {
          if (day.monthLeave + 1 == month) {
            if (i == day.dayStartLeave) {
              timeAnnualLeave = day.timesLeave;
              timeWorkInDay = timeWorkInDay - day.timesLeave;
            }
          }
        });

        // Loop all attendance and annualLeave to find this month have workTime and annualLeave or not
        attendance.forEach((workTime) => {
          const totalWorkHours = workTime.totalWorkHours;
          // Check this month whether day of startWork = day of selected month
          if (
            workTime.date.getDate() == i &&
            workTime.date.getMonth() + 1 == month
          ) {
            listDayLeave.forEach((day) => {
              // If yes, continue check day of starWork = day of annualLeave
              if (
                day.dayStartLeave <= workTime.date.getDate() &&
                day.dayEndLeave >= workTime.date.getDate()
              ) {
                timeAnnualLeave = day.timesLeave;
              }
              timeWorkInDay = totalWorkHours;
            });
          }
        });

        // Caculate shortime
        shortTime +=
          timeWorkInDay + timeAnnualLeave > 8
            ? 0
            : 8 - (timeWorkInDay + timeAnnualLeave);
      }

      const getSalary =
        staff.salaryScale * 3000000 + (totalOverTime - shortTime) * 200000;

      const salary = new Salary({
        month: month,
        salary: getSalary,
      });
      salary.save();
      res.redirect('/workTime/salary');
    })

    .catch((err) => console.log(err));
};

// @desc    Get salary
// @route   GET /workTime/salary
exports.getSalary = (req, res) => {
  Salary.find({})
    .then((salary) => {
      res.render('workTime/salary', {
        path: '/workTime/salary',
        pageTitle: 'Salary Information',
        salary: salary[salary.length - 1],
      });
    })
    .catch((err) => console.log(err));
};
