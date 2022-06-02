const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const staffSchema = new Schema({
  name: { type: String },
  userName: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  dOB: { type: Date },
  salaryScale: { type: Number },
  startDate: { type: Date },
  department: { type: String },
  annualLeave: { type: Number },
  image: { type: String },
});

module.exports = mongoose.model('Staff', staffSchema);
