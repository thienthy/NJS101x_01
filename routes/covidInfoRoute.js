const express = require('express');
const router = express.Router();

const covidInfoController = require('../controllers/covidInfoController');
const isAuth = require('../middlewares/isAuth');

router.get('/', isAuth, covidInfoController.getCovidIndex);

// Regist teperature router
router.post('/temperature', covidInfoController.postTemperature);

// Regist vaccine router
router.post('/vaccine', covidInfoController.postVaccine);

// Regist infection router
router.post('/infection', covidInfoController.postInfection);

// Display staff covid information router
router.get('/information', covidInfoController.getStaffCovidInfo);

// Display all staff covid information (for manager) router
router.get('/allStaffInformation', covidInfoController.getAllStaffCovidInfo);

// Export covid information to PDF
router.get('/information/:id', covidInfoController.getPDF);

module.exports = router;
