const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const annualLeaveSchema = new Schema({
  name: { type: String },
  staffId: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
  },
  daysLeave: { type: String },
  numberOfDaysLeave: { type: Number },
  hoursRequested: { type: Number },
  daysUsed: { type: Number },
  reason: { type: String },
});

module.exports = mongoose.model('AnnualLeave', annualLeaveSchema);
