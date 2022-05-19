const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  name: { type: String },
  date: { type: Date, default: new Date() },
  workTimes: [
    {
      startTime: { type: Date },
      endTime: { type: Date },
      workPlace: { type: String },
      working: { type: Boolean },
      timeWorked: { type: Number },
    },
  ],
  overTime: { type: Number },
  totalWorkHours: { type: Number },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
