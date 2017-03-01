const mongoose = require('mongoose');
const User = require("./user");
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
// Define the schema for users
const issueSchema = new Schema({
  status: {
    type: String,
    required: true,
    enum :['new', 'inProgress', 'completed', 'canceled'],
    default: "new"
  },
  description:{
    type: String,
    maxlength: [ 1000, 'Description is too long' ]
  },
  imageUrl : {
    type: String,
    maxlength: 50
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  tags: [{ type: String, minlength: 3 }],
  user: {
    type: Schema.Types.ObjectId,
    required:true,
    ref: 'Person',
    validate: {
      // valide que le user existe avec la fonction existingUser
      validator: existingUser
    }
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

/**
 * fonction qui valide si le user existe, via son id
 */
function existingUser(value, callback) {
  User.findOne({ '_id': value }, function (err, user){
    if (user){
      callback(true);
    } else {
      callback(false);
    }
  });
}

// Create the model from the schema and export it
module.exports = mongoose.model('Issue', issueSchema);