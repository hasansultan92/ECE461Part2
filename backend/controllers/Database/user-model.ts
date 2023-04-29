import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
  {
    name: {type: String, unique: true},
    password: {type: String},
    token: {type: String},
  },
  {timestamps: true}
);

module.exports = mongoose.model('user', userSchema);
