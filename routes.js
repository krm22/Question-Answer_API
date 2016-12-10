'use strict'
/* Requiring express package from app.js after
    import form npm and main entry point JSON config in package.json*/
let express = require("express");
/* Router module of express, this object is what we pass into the
    main app.js by exporting th router at the bottm of the app */
let router = express.Router();

//GET /questions
/*The first route handler is attached to the get request and router
object, after the app.js file handles the request to the router it strips away
what was already matched ex /questions , everything other rote is built on to
this / slash. */
router.get("/", function(req, res) {
    /*send a response to the client*/
    res.json({
        response: "You sent me GET a requset"
    });
});


//POST /questions
/* route for creating questions */
router.post("/", function(req, res) {
    res.json({
        response: "You sent me a POST Request",
        body: req.body
    });
});

//GET /questions/:qID
//Route for specific questions
router.get("/:qID", function(req, res) {
    res.json({
        response: "You sent me GET a requset for id" + req.params.qID
    });
});


//POST /questions/:id/answers
/* route for creating questions */
router.post("/:qID/answers", function(req, res) {
    res.json({
        response: "You sent me a POST Request to /answers",
        questionsId: req.params.qID,
        body: req.body
    });
});

//Put /questions/:qID/answers/:aID
//Edit a specific answer
router.put("/:qID/answers/:aID", function(req, res){
  res.json({
      response: "You sent me a PUT Request to /answers",
      questionsId: req.params.qID,
      anwsersId: req.params.aID,
      body: req.body
  });
})

//DELETE /questions/:qID/answers/:aID
//Delete a specific answer
router.delete("/:qID/answers/:aID", function(req, res, next){
  res.json({
      response: "You sent me DELETE Request to /answers",
      questionsId: req.params.qID,
      anwsersId: req.params.aID
  });
});

//POST /questions/:qID/answers/:aID/vote-up
//POST /questions/:qID/answers/:aID/vote-down
//Vote on a specific answer
router.post("/:qID/answers/:aID/vote-:dir", function(req, res, next){
  if(req.params.dir.search(/^(up|down)$/) === -1){
        let err = new Error("Not Found");
        err.status = 404;
        next(err);
    }else{
        next();
    }
},function(req, res){
  res.json({
      response: "You sent me POST Request to /vote-" + req.params.dir,
      questionsId: req.params.qID,
      anwsersId: req.params.aID,
      vote:  req.params.dir
  });
})




/*export router into the main app.js file*/
module.exports = router;
