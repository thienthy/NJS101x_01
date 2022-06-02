const express = require('express');

const attendanceController = require('../controllers/attendanceController');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.get('/', isAuth, attendanceController.getIndex);

// start work router
router.get('/start', attendanceController.getStartWork);
router.post('/start', attendanceController.postStartWork);
router.get('/workingInfo', attendanceController.getInfoStart);

// end work router
router.post('/end', attendanceController.postEndWork);
router.get('/endWork', attendanceController.getInfoEnd);

// annual leave router
router.get('/annualLeave', attendanceController.getAnnualLeaveRegister);
router.post('/leaveForm', attendanceController.postAnnualLeaveRegister);

module.exports = router;
