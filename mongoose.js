'use strict'


/* requiring the mongoose package after  installation and giving it the variable
    mongoose */
let mongoose = require("mongoose");

/* Using the mongoose connect method to connect to mongodb server. */
mongoose.connect("mongodb://localhost:27017/sandbox");

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

    /* create a Schema ny referencing the schema construtor from the
     mongoose object. */
    let Schema = mongoose.Schema;
    /* Making a Schema to track animals, by calling new on the Schema
    construtor object, giving a default animal object as well. */
    let AnimalSchema = new Schema({
        type: {
            type: String,
            default: "goldfish"
        },
        size: {
            type: String,

        },
        color: {
            type: String,
            default: "golden"
        },
        mass: {
            type: Number,
            default: "0.007"
        },
        name: {
            type: String,
            default: "Angela"
        }
    });
/* This is a prehook designed to attach to the save object and give a dynamic
 animal size input */
    AnimalSchema.pre('save', function(next){
      if(this.mass >= 100){
        this.size = "big";
      }else if(this.mass >= 5 && this.mass < 100){
        this.size = "medium";
      }else {this.size = "small";
      }
      next();
    })
    AnimalSchema.statics.findSize = function(size, callback){
      // this == Animal
      return this.find({size : size }, callback);
    }



    /* Now we use the AnimalSchema to create a mongoose object called a model
    which creates and saves our document objects */
    let Animal = mongoose.model("Animal", AnimalSchema);


    /* Create an elephant object calling the Animal constructor
    function , mongo does not know about this object yet as it hasnt been saved */
    let elephant = new Animal({
        type: "elephant",
        color: "gray",
        mass: 6000,
        name: "Lawrence"
    });

    let animal = new Animal({}); //goldfish

    /* This is to test if the missing key picks up the value of the default*/
    let whale = new Animal({
        type: "whale",
        mass: 190500,
        name: "Fig"
    });

    let animalData = [{
            type: "mouse",
            color: "grey",
            mass: 0.035,
            name: "Marvin"
        }, {
            type: "nutria",
            color: "brown",
            mass: 6.35,
            name: "Gretchen"
        }, {
            type: "wolf",
            color: "grey",
            mass: 45,
            name: "Gretchen"
        },
        elephant,
        animal,
        whale
    ];
    /* Using the animals models remove method to empty the animals document
     in mongo db */
    Animal.remove({}, function(err) {
        /*  This is where we use the save method of mongoose to register the first
            document object with Mongodb, we also declare the remove method to
            empty the collection before saving the elephant and the default
            animal and the whale which should inherit the value of the default animal
            due to missing schema key value pair. (This is a pyramid of doom.) */
        if (err) console.error(err);
        Animal.create(animalData, function(err, animals) {
            if (err) console.error(err);
            Animal.findSize("medium", function(err, animals) {
                animals.forEach(function(animal) {
                    console.log(animal.name + " the " + animal.color +
                        " " + animal.type + " is a " + animal.size + "-sized animal.");
                });
                db.close(function() {
                    console.log("db connection saved");
                });
            });
        });
    });
});
