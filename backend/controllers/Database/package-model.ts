import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: {type: String, unique: true},
    version: {type: Array},
    repository: {type: Array},
    scores: {type: Array},
    id: {type: Array, unique: true},
    history: {
      type: Array,
      default: {
        User: {
          name: {type: String},
          isAdmin: {type: Boolean},
        },
        Date: {type: Date, default: Date.now},
        PackageMetadata: {
          Name: {type: String},
          Version: {type: String},
          ID: {type: String},
        },
        Action: {
          type: String,
          enum: ['UPDATE', 'RATE', 'CREATE'],
          default: 'RATE',
        },
      },
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model('package', packageSchema);
