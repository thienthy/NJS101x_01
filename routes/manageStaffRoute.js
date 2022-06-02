const express = require('express');

const manageStaffController = require('../controllers/manageStaffController');
const isAuth = require('../middlewares/isAuth');

const route = express.Router();

route.get('/', isAuth, manageStaffController.getIndex);
route.post('/staff', manageStaffController.postManageStaff);

// Delete workTime router
route.post('/postDeleteWorkTime', manageStaffController.postDeleteWorkTime);

// Confirm workTime router
route.post('/confirmTimeWork', manageStaffController.postConfirmTimeWork);

// Cancel confirm workTime router
route.post(
  '/cancelConfirmTimeWork',
  manageStaffController.postCancelConfirmTimeWork
);

module.exports = route;
