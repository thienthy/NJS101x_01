const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const covidSchema = new Schema({
  name: { type: String },
  staffId: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
  },
  bodyTemperature: [
    {
      temperature: {
        type: Number,
      },
      date: {
        type: Date,
      },
      time: {
        type: String,
      },
    },
  ],
  vaccineInfo: [
    {
      nameVaccine: { type: String },
      date: { type: Date },
    },
  ],
  infectionCovidInfo: [
    {
      dateInfected: { type: Date },
      dateRecover: { type: Date },
    },
  ],
});

module.exports = mongoose.model('Covid', covidSchema);
