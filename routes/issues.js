var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');


/* GET users listing. */
router.get('/', function(req, res, next) {
  Issue.find().sort('name').exec(function(err, issues) {
    if (err) {
      return next(err);
    }
    res.send(issues);
  });
});

/* POST new user */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newIssue = new Issue(req.body);
  // Save that document
  newIssue.save(function(err, savedIssue) {
    if (err) {
      return next(err);
    }
    // Send the saved document in the response
    res.send(savedIssue);
  });
});

module.exports = router;
