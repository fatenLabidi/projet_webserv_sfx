var express = require('express');
var router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * @api {get} /users Retrieve a user
 * @apiName RetrieveUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription récuperer un utilisateur
 *
 * @apiUse UserIdInUrlPath
 * @apiUse UserInResponseBody
 * @apiUse UserNotFoundError
 *
 * @apiExample Example
 *     GET /user/58b2926f5e1def0123e97188 HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *     {
 *       "id": "58b2926f5e1def0123e97188",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "role": "citizen",
 *       "--v": 0,
 *       "createdAt": "2017-02-28T14:16:25.000Z"
 *     }
 */
router.get('/:id',loadUserFromParamsMiddleware, function(req, res, next) {
  res.send(req.user);
});

/**
 * @api {get} /users Retrieve all user
 * @apiName RetrieveUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription récuperer tout les utilisateurs
 *
 * @apiUse UserInResponseBody
 *
 * @apiExample Example
 *     GET /users HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *     {
 *       "id": "58b2926f5e1def0123e97188",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "role": "citizen",
 *       "--v": 0,
 *       "createdAt": "2017-02-28T14:16:25.000Z"
 * 
 *      "id": "58b2926f5e1def0123efef97188",
 *       "firstName": "Simon  ",
 *       "lastName": "Loto",
 *       "role": "citizen",
 *       "--v": 0,
 *       "createdAt": "2017-02-27T14:15:25.000Z"
 *     }
 */
router.get('/', function(req, res, next) {
  User.find().sort('name').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

/**
 * @api {post} /users Create a user
 * @apiName CreateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Enregistrer un nouvel utilisateur
 *
 * @apiUse UserInRequestBody
 * @apiUse UserInResponseBody
 * @apiUse UserValidationError
 *
 *
 * @apiExample Example
 *     POST /users HTTP/1.1
 *     Content-Type: application/json
 *
 *    {
 *       "id": "58b2926f5e1def0123e97188",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "role": "citizen",
 *       "--v": 0,
 *       "createdAt": "2017-02-28T14:16:25.000Z"
 *     }
 *
 * @apiSuccessExample 201 Created
 *     HTTP/1.1 201 Created
 *     Content-Type: application/json
 *     Location: https://heigvd-webserv-2017-team-6.herokuapp.com/users/58b2926f5e1def0123e97188
 *
 *     {
 *       "id": "58b2926f5e1def0123e97188",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "role": "citizen",
 *       "--v": 0,
 *       "createdAt": "2017-02-28T14:16:25.000Z"
 *     }
 */
router.post('/', validateUserUniqueness,function(req, res, next) {
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
 * @api {patch} /users/:id Update a user
 * @apiName Update a user
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription mise à jour partielle (ou totale) des données utilisateur
 * 
 * @apiUse UserInRequestBody
 * @apiUse UserInResponseBody
 * @apiUse UserNotFoundError
 * @apiUse UserValidationError
 *
 * @apiExample Example
 *     PATCH /users/58b2926f5e1def0123e97281 HTTP/1.1
 *     Content-Type: application/json
 *
 *     {
 *       "role": "citizen"
 *     }
 */
router.patch('/:id', loadUserFromParamsMiddleware, validateUserUniqueness ,function(req, res, next) {

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
 * Responds with 404 Not Found and a message indicating that the user with the specified ID was not found.
 */

function userNotFound(res, userId) {
  return res.status(404).type('text').send(`No user found with ID ${userId}`);
}

function validateUserUniqueness(req,res,next){
  /*OPTIMISATION : Faire ce if seulement si la méthode est get mais pas pour le post*/
  /*if(req.body.firstName === undefined || req.body.lastName === undefined){
    return next();
  }*/
  User.findOne().where('firstName').equals(req.body.firstName).
  where('lasttName').equals(req.body.lasttName).exec(function(err, existingUser){
    //callback(!err & (!existing || existingUser._id.equals(user._id)));
    if(err){
      return next(err);
    }
    if (!existingUser) {
      return next();
    }
    else{
      return res.status(422).type('text').send(`User already exists`);
    }
  });
}

/**
 * @apiDefine UserIdInUrlPath
 * @apiParam (URL path parameters) {String} id The unique identifier of the person to retrieve
 */

/**
 * @apiDefine UserInRequestBody
 * @apiParam (Request body) {String{2..20}} FirstName prénom de l'utilisateur. Attention, la combinaise du prénom et du nom doit être unique
 * @apiParam (Request body) {String{2..20}} LastName nom de l'utilisateur. Attention, la combinaise du prénom et du nom doit être unique
 * @apiParam (Request body) {String="citizen, manager"} role Role que rempli l'utilisateur
 */

/**
 * @apiDefine UserInResponseBody
 * @apiSuccess (Response body) {String} FirstName prénom de l'utilisateur
 * @apiSuccess (Response body) {String} LastName nom de l'utilisateur
 * @apiSuccess (Response body) {enum} role Role que rempli l'utilisateur
 * @apiSuccess (Response body) {Date} createdAt The date at which the person was registered
 */

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError {Object} 404/`No user found with ID ${userId}`
 *
 * @apiErrorExample {json} 404 Not Found
 *     HTTP/1.1 404 Not Found
 *     Content-Type: text/plain
 *
 *     No user found with ID 58b2926f5e1def0123e97bc0
 */


/**
 * @apiDefine UserValidationError
 *
 * @apiError {Object} 422/`User already exists`
 *
 * @apiErrorExample {json} 422 Unprocessable Entity
 *     HTTP/1.1 422 Unprocessable Entity
 *     Content-Type: text/plain
 *
 *    User already exists
 */
module.exports = router;
