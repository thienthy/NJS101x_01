const express = require('express');
const router = express.Router();

const staffController = require('../controllers/staffController');

router.get('/infoStaff', staffController.getInfoStaff);
router.post('/infoStaff/edit', staffController.postEditStaff);

module.exports = router;
