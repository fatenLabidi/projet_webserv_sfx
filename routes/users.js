var express = require('express');
var router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find().sort('name').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

/* POST new user */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newUser = new User(req.body);
  // Save that document
  newUser.save(function(err, savedUser) {
    if (err) {
      return next(err);
    }
    // Send the saved document in the response
    res.send(savedUser);
  });
});

/**
 * @api {patch} /api/movies/:id Partially update a movie
 * @apiName PartiallyUpdateMovie
 * @apiGroup Movie
 * @apiVersion 1.0.0
 * @apiDescription Partially updates a movie's data (only the properties found in the request body will be updated).
 * All properties are optional.
 *
 * @apiUse MovieIdInUrlPath
 * @apiUse MovieInRequestBody
 * @apiUse MovieInResponseBody
 * @apiUse MovieNotFoundError
 * @apiUse MovieValidationError
 *
 * @apiExample Example
 *     PATCH /api/movies/58b2926f5e1def0123e97281 HTTP/1.1
 *     Content-Type: application/json
 *
 *     {
 *       "rating": 6.7
 *     }
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *     {
 *       "id": "58b2926f5e1def0123e97281",
 *       "title": "Die Hard",
 *       "rating": 6.7,
 *       "directorHref": "/api/people/58b2926f5e1def0123e97bc0",
 *       "createdAt": "1988-07-12T00:00:00.000Z"
 *     }
 */
router.patch('/:id', loadUserFromParamsMiddleware, function(req, res, next) {

  // Update only properties present in the request body
  if (req.body.firstName !== undefined) {
    req.user.firstName = req.body.firstName;
  }
  if (req.body.lastName !== undefined) {
    req.user.lastName = req.body.lastName;
  }
  if (req.body.role !== undefined) {
    req.user.role = req.body.role;
  }
  req.user.save(function(err, savedUser) {
    if (err) {
      return next(err);
    }
    //debug(`Updated user "${savedUser.firstName}"`);
    res.send(savedUser);
  });
});

/**
 * Middleware that loads the movie corresponding to the ID in the URL path.
 * Responds with 404 Not Found if the ID is not valid or the movie doesn't exist.
 */
function loadUserFromParamsMiddleware(req, res, next) {

  const userId = req.params.id;
  if (!ObjectId.isValid(userId)) {
    return userNotFound(res, userId);
  }

  let query = User.findById(userId)

  query.exec(function(err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return userNotFound(res, userId);
    }

    req.user = user;
    next();
  });
}

/*
/**
 * Responds with 404 Not Found and a message indicating that the movie with the specified ID was not found.
 */
 /*
function userNotFound(res, userId) {
  return res.status(404).type('text').send(`No user found with ID ${userId}`);
}

function validateUserUniqueness(value1,value2, callback){
  const user = this,
  this.constructor.findOne().where('firstName').equals(value1).
  where('lasttName').equals(value2).exec(function(err, existingUser){
    callback(!err & (!existing || existingUser._id.equals(user._id)));
  });
}

/**
 * Responds with 404 Not Found and a message indicating that the movie with the specified ID was not found.
 *//*
function userAlreadyExist(res,value1,value2, callback) {
  if(validateUserUniqueness(value1,value2, callback)){
    return res.status(400).type('text').send(`User already exists`);
  }
  next();
}
*/
module.exports = router;
