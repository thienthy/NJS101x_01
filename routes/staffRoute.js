const express = require('express');
const router = express.Router();

const staffController = require('../controllers/staffController');
const isAuth = require('../middlewares/isAuth');

router.get('/infoStaff', isAuth, staffController.getInfoStaff);
router.post('/infoStaff/edit', staffController.postEditStaff);

module.exports = router;
