var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


/* GET Issues listing. */
router.get('/', function(req, res, next) {
  let query = Issue.find().sort('status');

  //pagination
  let page = parseInt(req.query.page,10);
  if(isNaN(page)|| page < 1){
    page = 1;
  }

  let pageSize = parseInt(req.query.pageSize, 10);
  if(isNaN(pageSize)|| pageSize < 0 || pageSize > 100){
    page = 100;
  }

  query = query.skip((page - 1)*pageSize).limit(pageSize);

  res.set('Pagination-Page', page);
  res.set('Pagination-PageSize', pageSize);
  res.set('Pagination-Total', res);

  if(req.query.userId !== undefined){
    query = query.where("user").equals(req.query.userId);
  }
  //Execute the query
  query.exec(function(err, issues) {
    if (err) {
          return next(err);
    }
    res.send(issues);
  });
});

/* GET one issue */
router.get('/:id',loadIssueFromParamsMiddleware, function(req, res, next) {
  res.send(req.issue);
});

/* POST new issue */
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


router.patch('/:id', loadIssueFromParamsMiddleware, function(req, res, next) {

  // Update only properties present in the request body
  if (req.body.status !== undefined) {
    req.issue.status = req.body.status;
  }
  if (req.body.description !== undefined) {
    req.issue.description = req.body.description;
  }
  if (req.body.imageUrl !== undefined) {
    req.issue.imageUrl = req.body.imageUrl;
  }
    if (req.body.latitude !== undefined) {
    req.issue.latitude = req.body.latitude;
  }
    if (req.body.longitude !== undefined) {
    req.issue.longitude = req.body.longitude;
  }
    if (req.body.tags !== undefined) {
    req.issue.tags = req.body.tags;
  }
  if (req.body.user !== undefined) {
    req.issue.user = req.body.user;
  }
  //Change the date of modifictaion
  req.issue.updatedAt = Date.now();

  req.issue.save(function(err, savedIssue) {
    if (err) {
      return next(err);
    }
    //debug(`Updated user "${savedUser.firstName}"`);
    res.send(savedIssue);
  });
});

router.delete('/:id', loadIssueFromParamsMiddleware, function(req, res, next) {
  // Check and delete an issue
    req.issue.remove(function(err) {
      if (err) {
        return next(err);
      }
      res.sendStatus(204);
    });
  });

/**
 * Middleware that loads the movie corresponding to the ID in the URL path.
 * Responds with 404 Not Found if the ID is not valid or the movie doesn't exist.
 */
function loadIssueFromParamsMiddleware(req, res, next) {

  const issueId = req.params.id;
  if (!ObjectId.isValid(issueId)) {
    return issueNotFound(res, issueId);
  }
  let query = Issue.findById(issueId)
  query.exec(function(err, issue) {
    if (err) {
      return next(err);
    } else if (!issue) {
      return issueNotFound(res, issueId);
    }

    req.issue = issue;
    next();
  });
}

module.exports = router;
