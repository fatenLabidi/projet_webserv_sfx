const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const issueSchema = new Schema({
  name: String
});
// Create the model from the schema and export it
module.exports = mongoose.model('Issue', issueSchema);