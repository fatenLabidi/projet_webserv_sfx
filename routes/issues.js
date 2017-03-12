var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


/* GET Issues listing. */
/**
 * @api {get} /issues retrieve list of issues
 * @apiName RetrieveIssues
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Récuperer la listes des problèmes
 *
 *
 * @apiUse IssueInResponseBody
 *
 *
 * @apiExample Example
 *     GET /issues?user=58b2926f5e1def0123e97bc0&page=2&pageSize=50 HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     Link: &lt;https://heigvd-webserv-2017-team-6.herokuapp.com/issues?page=1&pageSize=50&gt;; rel="first prev"
 *
 *     [
 *       {
 *        "id":"58b6bde46706dc0011e23456"
 *        "status":"new",
 *        "description":"test",
 *        "imageUrl":"C://images1",
 *        "latitude":123456,
 *        "longitude":23456",
 *        "tags":["lumière","tolle", "feu"],
 *        "user":"58b6bde46706dc0011e42a91"
 *        "createdAt": "2017-02-28T14:16:25.000Z"
 *       },
 *       {
 *        "id":"58b6bde46706dc0011e73569"
 *        "status":"new",
 *        "description":"retest",
 *        "imageUrl":"C://images2",
 *        "latitude":3534625,
 *        "longitude":2332423,
 *        "tags":["tag","violence", "urgent"],
 *        "user":"58b6bde46706dc0011e42a51"
 *        "createdAt": "2017-01-28T14:16:25.000Z"
 *       }
 *     ]
 **/
 
router.get('/', function(req, res, next) {
  var countQuery = Issue.count();
  var query = Issue.find().sort('status');

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

    if(req.query.userId !== undefined){
      query = query.where("user").equals(req.query.userId);
      countQuery = countQuery.where("user").equals(req.query.userId);
    }

  countQuery.exec(function(err, total) {
      if (err) {
            return next(err);
      }
    query.exec(function(err, issues) {
        res.set('Pagination-Page', page);
        res.set('Pagination-PageSize', pageSize);
        res.set('Pagination-Total', total);
        res.send(issues);
    });
  });
});

/* GET one issue */
/**
 * @api {get} /issues retrieve one issue
 * @apiName RetrieveIssue
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription récuperer un problème
 *
 * @apiUse IssueIdInUrlPath
 * @apiUse IssueInResponseBody
 * @apiUse IssueNotFoundError
 *
 * @apiExample Example
 *     GET /issues/58b2926f5e1def0123e97281 HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *     {
 *        "id":"58b6bde46706dc0011e23456"
 *        "status":"new",
 *        "description":"retest",
 *        "imageUrl":"C://images",
 *        "latitude":123456,
 *        "longitude":23456,
 *        "tags":["lol","rire", "test"],
 *        "user":"58b6bde46706dc0011e42a91"
 *        "createdAt": "2017-02-28T14:16:25.000Z"
 *     }
 * */

router.get('/:id',loadIssueFromParamsMiddleware, function(req, res, next) {
  res.send(req.issue);
});

/* POST new issue */
/**
 * @api {post} /issues Create a issue
 * @apiName CreateIssue
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Enregistrer un nouveau problème
 *
 * @apiUse IssueInRequestBody
 * @apiUse IssueInResponseBody
 * @apiUse IssueValidationError

 *
 * @apiExample Example
 *     POST /issues HTTP/1.1
 *     Content-Type: application/json
 *
 *     {
 *        "status":"new",
 *        "description":"retest",
 *        "imageUrl":"C://images",
 *        "latitude":123456,
 *        "longitude":23456,
 *        "tags":["lol","rire", "test"],
 *        "user":"58b6bde46706dc0011e42a91"
 *        "createdAt": "2017-02-28T14:16:25.000Z"
 *     }
 *
 * @apiSuccessExample 201 Created
 *     HTTP/1.1 201 Created
 *     Content-Type: application/json
 *     Location:https://heigvd-webserv-2017-team-6.herokuapp.com/issues/58b6bde46706dc0011e23456
 *
 *     {
 *        "id":"58b6bde46706dc0011e23456"
 *        "status":"new",
 *        "description":"retest",
 *        "imageUrl":"C://images",
 *        "latitude":123456,
 *        "longitude":23456,
 *        "tags":["lol","rire", "test"],
 *        "user":"58b6bde46706dc0011e42a91"
 *        "createdAt": "2017-02-28T14:16:25.000Z"
 *     }
 */
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

/**
 * @api {patch} /issues update one issue
 * @apiName UpdateIssue
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription mettre à jour un problème
 *
 * @apiUse IssueIdInUrlPath
 * @apiUse IssueInRequestBody
 * @apiUse IssueInResponseBody
 * @apiUse IssueNotFoundError
 * @apiUse IssueValidationError
 *
 * @apiExample Example
 *     PATCH /issues/58b6bde46706dc0011e23456 HTTP/1.1
 *     Content-Type: application/json
 *
 *     {
 *       "status": "inProgress"
 *     }
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *     {
 *       "id":"58b6bde46706dc0011e23456"
 *        "status":"new",
 *        "description":"retest",
 *        "imageUrl":"C://images",
 *        "latitude":123456,
 *        "longitude":23456,
 *        "tags":["lol","rire", "test"],
 *        "user":"58b6bde46706dc0011e42a91"
 *        "createdAt": "2017-02-28T14:16:25.000Z"
 *     }
 * */

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

/**
 * @api {delete} /issues delete a issue
 * @apiName DeleteIssue
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription supprimer un problème
 *
 * @apiUse IssueIdInUrlPath
 * @apiUse IssueNotFoundError
 *
 * @apiExample Example
 *     DELETE /api/movies/58b2926f5e1def0123e97bc0 HTTP/1.1
 *
 * @apiSuccessExample 204 No Content
 *     HTTP/1.1 204 No Content
 * */

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

/**
 * @apiDefine IssueIdInUrlPath
 * @apiParam (URL path parameters) {String} id identifiant unique que le problème reçoit
 */

/**
 * @apiDefine IssueInRequestBody
 * @apiParam (Request body) {String="new, inProgress, completed, canceled"} Status le statut du problème <br/>
 * par défaut à "new" quand le problème est créé <br/>
 * changer de "new" à "inProgress" indique que l'employé de la ville travaille sur le problèmeto <br/>
 * changer de "new" ou "inProgress" à "canceled" indique que l'employé de la ville a determiné que ce n'était pas un problème<br/>
 * changer de "inProgress" à "completed" indique que le problème a été résolue<br/>
 * @apiParam (Request body) {String{..1000}} [Description] description les détails du problème
 * @apiParam (Request body) {String{..50}} [ImageUrl] le lien de l'image 
 * @apiParam (Request body) {Number} Latitude la latitude pour localisé le problème
 * @apiParam (Request body) {Number} Longitude la longitude pour localisé le problème
 * @apiParam (Request body) {String[]{3..}} Tags des mots décrivant la nature de le problème
 * @apiParam (Request body) {String} User l'utilisateur associé à le problème
 */

/**
 * @apiDefine IssueInResponseBody
 * @apiSuccess (Response body) {String} id l'identifiant unique de l'issue créer par le serveur
 * @apiSuccess (Response body) {enum} Status le statut du problème
 * @apiSuccess (Response body) {String} Description les détails du problème
 * @apiSuccess (Response body) {String} ImageUrl le lien de l'image
 * @apiSuccess (Response body) {Number} Latitude la latitude pour localisé l'issue
 * @apiSuccess (Response body) {Number} Longitude la longitude pour localisé l'issue
 * @apiSuccess (Response body) {String} Tags des mots décrivant la nature de l'issue
 * @apiSuccess (Response body) {String} User l'utilisateur associé à l'issue
 * @apiSuccess (Response body) {String} UpdateAt la date de modification de l'issue
 * @apiSuccess (Response body) {String} createdAt la date de création de l'issue
 * 
 * 
 * 
 * 
 */

/**
 * @apiDefine IssueNotFoundError
 *
 * @apiError {Object} 404/`No issue found with ID ${issueId}`
 *
 * @apiErrorExample {json} 404 Not Found
 *     HTTP/1.1 404 Not Found
 *     Content-Type: text/plain
 *
 *     No issues found with ID 58b2926f5e1def0123e97bc0
 */

/**
 * @apiDefine IssueValidationError
 *
 * @apiError {Object} 500/`Issue validation failed`
 *
 * @apiErrorExample {json} 500 Issue validation failed
 *     HTTP/1.1 500 Issue validation failed
 *     Content-Type: text/plain
 *
 *    Issue validation failed
 */

module.exports = router;
