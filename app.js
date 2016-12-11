'use strict'

/* BUILDING THE SERVER */

let express = require("express");
let app = express();

/* Now after we have required THE routes file we can use it
    in our middleware */
let routes = require("./routes");

let jparse = require("body-parser").json;
/* requiring automated logger*/
let logger = require("morgan");
/* REGERISTING MIDDLEWARE */

app.use(logger("dev"));

app.use(jparse());
/*routes can be connected to the app in the same way as the middleware
  with the USE method, we want this router to
  fire up when asked for "/questions" then will be
  passed back to the routes.js file to an event handler in it's router config
  */
  /* requiring the mongoose package after  installation and giving it the variable
      mongoose */
  let mongoose = require("mongoose");

  /* Using the mongoose connect method to connect to mongodb server. */
  mongoose.connect("mongodb://localhost:27017/qa");

  /* db now monitors the states of request through the connection object
    of mongoose, it will now emit events related to the db and when they occur
     we can handle them. */
  let db = mongoose.connection;

  /* listening for the error event with the on method error handler */
  db.on("error", function() {
      console.error("connection error:", err);
  });

  /* listening for the open event, it is emmited whent the connection to mongo is
  ready to go, fires handler just the first time an event occurs */
  db.once("open", function() {
      console.log("db connection sucessful");
      // All database communication goes here
  });

 /* questions router fixed then to be stripped to / */
app.use("/questions", routes)

/* catch 404 and forward to error handler */
app.use(function(req, res, next){
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error Handler (custom)
app.use(function(err,req,res,next){
  res.status(err.status || 500)
  res.json({
    error:{
      message: err.message
    }
  })
});




/* END OF MIDDLEWARE */

let port = process.env.PORT || 3000;


app.listen (port, function(){
    console.log("Express server is listening on port", port)
});

/* END OF BUILDING  THE SERVER */
