const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const managerSchema = new Schema({
  name: { type: String },
  staffId: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
  },
  confirmed: { type: Boolean },
  month: { type: Number },
});

module.exports = mongoose.model('Manager', managerSchema);
