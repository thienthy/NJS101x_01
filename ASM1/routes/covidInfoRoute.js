const express = require('express');
const router = express.Router();

const covidInfoController = require('../controllers/covidInfoController');

router.get('/', covidInfoController.getCovidIndex);
router.post('/temperature', covidInfoController.postTemperature);
router.post('/vaccine', covidInfoController.postVaccine);
router.post('/infection', covidInfoController.postInfection);
router.get('/information', covidInfoController.getCovidInfoDetail);

module.exports = router;
