const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const salarySchema = new Schema({
  month: { type: Number },
  salary: { type: Number },
});

module.exports = mongoose.model('Salary', salarySchema);
