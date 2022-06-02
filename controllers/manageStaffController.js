const Staff = require('../models/staffModel');
const Attendance = require('../models/attendanceModel');
const Manager = require('../models/managerModel');
const mongoose = require('mongoose');

// @desc    Display manage page
// @route   GET /manageStaff
exports.getIndex = (req, res) => {
  Staff.find({ role: 'staff' })
    .then((staffs) => {
      res.render('manage/index', {
        path: '/manageStaff',
        pageTitle: 'Manage Staff',
        staffs,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// @desc    Display workTime information of selected staff
// @route   POST /manageStaff/staff
exports.postManageStaff = async (req, res) => {
  const staff = await Staff.findById(req.body.staff);
  const manager = await Manager.find({
    staffId: req.body.staff,
    month: req.body.month,
  });
  Attendance.find({ staffId: req.body.staff })
    .then((attendance) => {
      // Filter month of workTime == select month
      const workTimes = attendance.filter((workTime) => {
        return workTime.date.slice(3, 5) === req.body.month;
      });
      res.render('manage/staff', {
        path: '/manageStaff',
        pageTitle: 'Manage Staff',
        attendance,
        workTimes,
        month: req.body.month,
        staff,
        isConfirm: manager[0],
      });
    })
    .catch((error) => {
      console.log(error);
    })

    .catch((error) => {
      console.log(error);
    });
};

// @desc    Delete workTime information of selected staff
// @route   POST /manageStaff/postDeleteWorkTime
exports.postDeleteWorkTime = async (req, res) => {
  const id = mongoose.Types.ObjectId(req.body.workTime);
  Attendance.deleteOne({ _id: id })
    .then(() => {
      res.redirect('/manageStaff');
    })
    .catch((error) => {
      console.log(error);
    });
};

// @desc    Confirm workTime of selected month
// @route   POST /manageStaff/confirmTimeWork
exports.postConfirmTimeWork = async (req, res, next) => {
  const staff = await Staff.findById(req.body.staffId);
  // Find manager collection which have staffId = select ID && month = select month
  Manager.find({ staffId: req.body.staffId, month: req.body.month })
    .then((manager) => {
      // Check last manager collection exist or not
      const newManager = manager[manager.length - 1];
      if (newManager) {
        return;
      }
      const confirmStaff = new Manager({
        name: staff.name,
        staffId: staff._id,
        confirmed: true,
        month: req.body.month,
      });
      confirmStaff.save();
    })
    .then((result) => {
      res.redirect('/manageStaff');
    })
    .catch((error) => {
      console.log(error);
    });
};

// @desc    Cancel workTime of selected month
// @route   POST /manageStaff/cancelConfirmTimeWork
exports.postCancelConfirmTimeWork = async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.body.staffId);
  Manager.deleteOne({ staffId: id, month: req.body.month })
    .then(() => {
      res.redirect('/manageStaff');
    })
    .catch((error) => {
      console.log(error);
    });
};
