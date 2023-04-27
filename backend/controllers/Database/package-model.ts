import mongoose from 'mongoose';
const packageSchema = new mongoose.Schema({
  name: {type: String, unique: true},
  version: {type: Array},
  repository: {type: Array},
  scores: {type: Array},
});

module.exports = mongoose.model('package', packageSchema);
