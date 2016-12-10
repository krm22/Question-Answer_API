'use strict'

let mongoose = require ("mongoose");

let Schema = mongoose.Schema;

let sortAnswers = function(a, b) {
    //-negative a before b
    //0 no change
    // + positve a after b
    if(a.votes == b.votes){
      return a.updatedAt - b.updatedAt;
    }
 return b.votes - a.votes;
}

let AnswerSchema = new Schema({
  text: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  votes: {type: Number, default: 0}
})

/* This instance method must be declared above its parent, wheare it will
  become an array */
AnswerSchema.methods("update", function (updates, callback){
    Object.assign(this, updates, {updatedAt: new Date()});
    this.parent().save(callback);
  });

AnswerSchema.methods("vote", function (vote, callback){
    if(vote == "up"){
     this.votes +=1;
   }else {
     this.votes -=1;
   }
   this.parent().save(callback);
});


//Parent Question Document
let QuestionSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    answers: [AnswerSchema]
});

/* set up a presave callback so the anwser schema is save in the parent
questions document */
QuestionSchema.pre("save", function (next){
  this.answers.sort(sortAnswers);
  next();
});


let Question = mongoose.model("Question", QuestionSchema);

// Importing into the routes file.
module.exports.Question = Question;
