const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: {type: String, unique: true},
  last_name: {type: String, default: null},
  password: {type: String},
  email: {type: String, default: null},
  token: {type: String},
});

module.exports = mongoose.model('user', userSchema);
