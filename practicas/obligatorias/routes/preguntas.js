const express = require('express');
const questionsRouter= express.Router();
const pool = require("../public/js/database");
const DaoQuestionAndAnswer = require('../public/js/DaoQuestionAndAnswer.js');

let daoQuestions = new DaoQuestionAndAnswer(pool);

questionsRouter.get("/", function(request, response){
    daoQuestions.readAllQuestion(function(error, data){
        if(error){
            response.redirect('/error');
        } else{
            response.status(200);
            response.render("questions", { questions: data });
        }
    });
});

module.exports = questionsRouter;