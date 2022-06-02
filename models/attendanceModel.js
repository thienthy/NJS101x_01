const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  name: { type: String },
  staffId: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
  },
  date: {
    type: String,
    default: new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
  },
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
