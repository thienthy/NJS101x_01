const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Staff = require('../models/staffModel');
const Covid = require('../models/covidInfoModel');

// @desc    Display covid page
// @route   GET /covid
exports.getCovidIndex = (req, res) => {
  Staff.findById(req.staff._id).then((staff) => {
    res.render('covidInfo/indexCovidInfo', {
      path: '/covid',
      pageTitle: 'Covid Information',
      role: staff.role,
    });
  });
};

// @desc    Regist body temperature
// @route   POST /covid/temperature
exports.postTemperature = (req, res) => {
  const registBodyTemperature = {
    temperature: req.body.temperature,
    date: req.body.dateOfTemperature,
    time: req.body.timeOfTemperature,
  };

  const newCovid = new Covid({
    name: req.staff.name,
    staffId: req.staff._id,
    bodyTemperature: [registBodyTemperature],
    vaccineInfo: [],
    infectionCovidInfo: [],
  });

  // Find exist documents and update bodyTemperature
  Covid.findOneAndUpdate(
    { staffId: req.staff._id },
    { bodyTemperature: [registBodyTemperature] }
  )
    .then((covid) => {
      // Save to database
      if (covid) {
        covid.save().then(() => {
          res.render('covidInfo/indexCovidInfo', {
            path: '/covid',
            pageTitle: 'Covid Information',
          });
        });
      }
      // Create new covid collection
      else {
        newCovid.save().then(() => {
          res.render('covidInfo/indexCovidInfo', {
            path: '/covid',
            pageTitle: 'Covid Information',
          });
        });
      }
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
  const newCovid = new Covid({
    name: req.staff.name,
    staffId: req.staff._id,
    bodyTemperature: [],
    vaccineInfo: [firstVaccine, secondVaccine],
    infectionCovidInfo: [],
  });

  // Find exist documents and update bodyTemperature
  Covid.findOneAndUpdate(
    { staffId: req.staff._id },
    { vaccineInfo: [firstVaccine, secondVaccine] }
  )
    .then((covid) => {
      // Save to database
      if (covid) {
        covid.save().then(() => {
          res.render('covidInfo/indexCovidInfo', {
            path: '/covid',
            pageTitle: 'Covid Information',
          });
        });
      }
      // Create new covid collection
      else {
        newCovid.save().then(() => {
          res.render('covidInfo/indexCovidInfo', {
            path: '/covid',
            pageTitle: 'Covid Information',
          });
        });
      }
    })
    .catch((error) => console.log(error));
};

// @desc    Regist infection covid
// @route   POST /covid/infection
exports.postInfection = (req, res) => {
  const registInfectionCovid = {
    dateInfected: req.body.infectedDate,
    dateRecover: req.body.recoverDate,
  };
  const newCovid = new Covid({
    name: req.staff.name,
    staffId: req.staff._id,
    bodyTemperature: [],
    vaccineInfo: [],
    infectionCovidInfo: [registInfectionCovid],
  });

  // Find exist documents and update bodyTemperature
  Covid.findOneAndUpdate(
    { staffId: req.staff._id },
    { infectionCovidInfo: [registInfectionCovid] }
  )
    .then((covid) => {
      // Save to database
      if (covid) {
        covid.save().then(() => {
          res.render('covidInfo/indexCovidInfo', {
            path: '/covid',
            pageTitle: 'Covid Information',
          });
        });
      }
      // Create new covid collection
      else {
        newCovid.save().then(() => {
          res.render('covidInfo/indexCovidInfo', {
            path: '/covid',
            pageTitle: 'Covid Information',
          });
        });
      }
    })
    .catch((error) => console.log(error));
};

// @desc    Inspect staff covid information
// @route   GET /covid/information
exports.getStaffCovidInfo = async (req, res) => {
  const staff = await Staff.findById(req.staff._id);
  Covid.find({ staffId: req.staff._id }).then((covid) => {
    res.render('covidInfo/covidInfoDetail', {
      path: '/covid',
      pageTitle: 'Covid Information Detail',
      covid: covid,
      role: staff.role,
    });
  });
};

// @desc    Inspect all staff covid information
// @route   GET /covid/allStaffInformation
exports.getAllStaffCovidInfo = async (req, res) => {
  const staff = await Staff.findById(req.staff._id);
  Covid.find({}).then((covid) => {
    res.render('covidInfo/covidInfoDetail', {
      path: '/covid',
      pageTitle: 'Covid Information Detail',
      covid: covid,
      role: staff.role,
    });
  });
};

// @desc    Export PDF file
// @route   GET /covid/information/:id
exports.getPDF = (req, res, next) => {
  const covidId = req.params.id;
  Covid.findById(covidId)
    .then((covid) => {
      const pdfName = 'covid-' + covidId + '.pdf';
      const pathDoc = path.join('data', 'CovidPDF', pdfName);
      const pdfDoc = new PDFDocument();
      res.setHeader('Content-type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + pdfName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(pathDoc));
      pdfDoc.pipe(res);
      pdfDoc.text('Tên nhân viên: ' + covid.name);
      pdfDoc.text('Nhiệt độ: ' + covid.bodyTemperature[0].temperature);
      pdfDoc.text('Vaccine mũi 1: ' + covid.vaccineInfo[0].nameVaccine);
      pdfDoc.text(
        'Ngày tiêm: ' + covid.vaccineInfo[0].date.toLocaleDateString()
      );
      pdfDoc.text('Vaccine mũi 2: ' + covid.vaccineInfo[1].nameVaccine);
      pdfDoc.text(
        'Ngày tiêm: ' + covid.vaccineInfo[1].date.toLocaleDateString()
      );
      pdfDoc.end();
    })
    .catch((error) => {
      console.log(error);
    });
};
