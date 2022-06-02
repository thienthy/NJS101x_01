const express = require('express');
const router = express.Router();

const workTimeController = require('../controllers/workTimeController');
const isAuth = require('../middlewares/isAuth');

router.get('/', isAuth, workTimeController.getIndexWorkTime);

// work time record router
router.get('/work', workTimeController.getWorkTimeRecord);

// annual leave record router
router.get('/annualLeave', workTimeController.getAnnualLeaveRecord);

// salary router
router.post('/salary', workTimeController.postSalary);
router.get('/salary', workTimeController.getSalary);

module.exports = router;
