'use strict'
/* Requiring express package from app.js after
    import form npm and main entry point JSON config in package.json*/
let express = require("express");

/* Router module of express, this object is what we pass into the
    main app.js by exporting th router at the bottm of the app */
let router = express.Router();

/* Importing the questions model to connect to the routers to the models */
let Question = require("./model").Question;

/* prefixing express's params handler because a url id exists, takes two parameters
 the name of the params on the string and a callback function */
router.param("qID", function(req, res, next, id) {
    Question.findById(id,function(err, doc){
        if (err) return next(err);
        if(!doc) {
          err = new Error("Not Found");
          err.status = 404;
          return next(err);
        }
          req.question = doc;
          return next();
    });
});


router.param("aID", function(req, res, next, id) {
  /* mongoose has a special method on sub docs array called id. The id method
  takes the id of a sub document and returns the sub doc with matching id */
    req.answer = req.question.answers.id(id);
    if(!req.answer) {
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    next();
  });



//GET /questions
/* The first route handler is attached to the get request and router
object, after the app.js file handles the request to the router it strips away
what was already matched ex /questions , everything other rote is built on to
this / slash. */
router.get("/", function(req, res, next) {
    /* On Question model call find method then an empty object literal
      and callback function, we ant the api to return all question docs.
      TO make sure the question objects come sorted so that the most
      recent comes first we need to find the method before the callback.
      If the second parameter is not a fuction the find method turns in to a
      mongoose projection, which returns only excepts of docs. So we passed
      in null as a second parameter then specify how to oreder results as a
      third parameter: Entering the sort property we can inject another object literal
      by entering the property of sort. Entering -1 means decending order,
      meaning the most recent date is now at the beginning. Without the placeholder
      null it would treat the second parameter as a projection. Null tells
       mongoose how to handle our response. With the exec property whe can execute
       the function. */
    Question.find({})
        .sort({createdAt: -1})
        .exec(function(err, questions) {
    if (err) return next(err);
    res.json(questions);
 });
});



//POST /questions
/* route for creating questions  */
router.post("/", function(req, res, next) {
   let question = new Question(req.body);
    question.save(function(err, question) {
        if (err) return next(err);
        res.status(201)
        res.json(question);
    });
});

//GET /questions/:qID
//Route for specific questions
router.get("/:qID", function(req, res, next) {
    /* Just sending document to the client as the router.params
    object at the top of the page is handling the search and errors */
      res.json(req.question);
    });



//POST /questions/:id/answers
/* route for creating answers */
router.post("/:qID/answers", function(req, res, next) {
 /* After getting the ref to the preloaded question we push the object literal
  to the document we want to add */
   req.question.answers.push(req.body);
   /*Mongoose creates the doc for us,we call save on the question doc. */
   req.question.save(function(err, question) {
       if (err) return next(err);
       res.status(201);
       res.json(question);
   });
});


//Put /questions/:qID/answers/:aID
//Edit a specific answer
router.put("/:qID/answers/:aID", function(req, res, next) {
  /* upadte object contains the things we want to modify in the req.body
   the a callback function to fire up the db for saving*/
    req.answer.update(req.body, function(err, result){
       if(err) return next(err);
       res.json(result); //sends reult back to the client
     });
    });


//DELETE /questions/:qID/answers/:aID
//Delete a specific answer
router.delete("/:qID/answers/:aID", function(req, res, next) {
 /* the remove method of mongoose doc's allows us to remove data from the answer
  then in the callback save the parent question */
   req.answer.remove(function(err){
      req.question.save(function(err, question){
        if(err) return next(err);
        res.json(question); // send question back to the client.
      });
   });
});

//POST /questions/:qID/answers/:aID/vote-up
//POST /questions/:qID/answers/:aID/vote-down
//Vote on a specific answer
router.post("/:qID/answers/:aID/vote-:dir", function(req, res, next) {
    if (req.params.dir.search(/^(up|down)$/) === -1) {
        let err = new Error("Not Found");
        err.status = 404;
        next(err);
     } else {
        req.vote = req.params.dir;
        next();
     }
 },
function(req, res, next) {
        req.answer.vote(req.vote, function(err, question){
          if(err) return next(err);
          res.json(question);
          next();
        });
    });

/* export router into the main app.js file */
module.exports = router;
