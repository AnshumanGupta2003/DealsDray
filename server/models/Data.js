const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // Ensure username is included
  password: { type: String, required: true },
});

const DataModel = mongoose.model('Data', DataSchema);

module.exports = DataModel;
