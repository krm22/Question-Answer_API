'use strict'

/* BUILDING THE SERVER */

let express = require("express");
let app = express();

/* Now after we have required THE routes file we can use it
    in our middleware */
let routes = require("./routes");

let jparse = require("body-parser").json;
/* requiring automated logger*/
let logger = require("morgan")

/* REGERISTING MIDDLEWARE */

app.use(logger("dev"));

app.use(jparse());
/*routes can be connected to the app in the same way as the middleware
  with the USE method, we want this router to
  fire up when asked for "/questions" then will be
  passed back to the routes.js file to an event handler in it's router config
  */
app.use("/questions", routes)

/* END OF MIDDLEWARE */

let port = process.env.PORT || 3000;


app.listen (port, function(){
    console.log("Express server is listening on port", port)
});

/* END OF BUILDING  THE SERVER */