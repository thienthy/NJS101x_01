const Covid = require('../models/covidInfoModel');

// @desc    Display covid page
// @route   GET /covid
exports.getCovidIndex = (req, res) => {
  res.render('covidInfo/indexCovidInfo', {
    path: '/covid',
    pageTitle: 'Covid Information',
  });
};

// @desc    Regist body temperature
// @route   POST /covid/temperature
exports.postTemperature = (req, res) => {
  Covid.findOneAndUpdate(req.params.id, {
    bodyTemperature: [
      {
        temperature: req.body.temperature,
        date: req.body.dateOfTemperature,
        time: req.body.timeOfTemperature,
      },
    ],
  })
    .then((covid) => {
      return covid.save();
    })
    .then(() => {
      res.render('covidInfo/indexCovidInfo', {
        path: '/covid',
        pageTitle: 'Covid Information',
      });
    })
    .catch((error) => console.log(error));
};

// @desc    Regist vaccine info
// @route   POST /covid/vaccine
exports.postVaccine = (req, res) => {
  const firstVaccine = {
    nameVaccine: req.body.nameOfFirstVaccine,
    date: req.body.dateOfFirstVaccine,
  };
  const secondVaccine = {
    nameVaccine: req.body.nameOfSecondVaccine,
    date: req.body.dateOfSecondVaccine,
  };
  Covid.findOneAndUpdate(req.params.id, {
    vaccineInfo: [firstVaccine, secondVaccine],
  })
    .then((covid) => {
      return covid.save();
    })
    .then(() => {
      res.render('covidInfo/indexCovidInfo', {
        path: '/covid',
        pageTitle: 'Covid Information',
      });
    })
    .catch((error) => console.log(error));
};

// @desc    Regist infection covid
// @route   POST /covid/infection
exports.postInfection = (req, res) => {
  Covid.findOneAndUpdate(req.params.id, {
    infectionCovidInfo: [
      {
        dateInfected: req.body.infectedDate,
        dateRecover: req.body.recoverDate,
      },
    ],
  })
    .then((covid) => {
      return covid.save();
    })
    .then(() => {
      res.render('covidInfo/indexCovidInfo', {
        path: '/covid',
        pageTitle: 'Covid Information',
      });
    })
    .catch((error) => console.log(error));
};

// @desc    Inspect covid information
// @route   GET /covid/information
exports.getCovidInfoDetail = (req, res) => {
  Covid.find({}).then((covid) => {
    res.render('covidInfo/covidInfoDetail', {
      path: '/covid',
      pageTitle: 'Covid Information Detail',
      covid: covid[0],
    });
  });
};
