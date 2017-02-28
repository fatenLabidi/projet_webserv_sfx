const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [ 2, 'Firstname is too short' ],
    maxlength: [ 20, 'Firstname is too long' ]
  },
  lastName: {
    type: String,
    required: true,
    minlength: [ 2, 'Lastname is too short' ],
    maxlength: [ 20, 'Lastname is too long' ]
  },
  role: {
    type: String,
    required: true,
    enum: [ 'citizen', 'manager' ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ firstName: 1, lastName: 1  }, { unique: true });

// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);