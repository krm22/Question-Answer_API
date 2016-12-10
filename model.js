'use strict'

let mongoose = require ("mongoose");

let Schema = mongoose.Schema;

let AnswerSchema = new Schema({
  text: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  votes: {type: Number, default: 0}
})

let QuestionSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    answers: [AnswerSchema]
});

let Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;
