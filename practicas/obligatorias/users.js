
const express= require('express');
const usersRouter= express.Router();
const pool = require("./public/js/database");
const DaoUsers = require('./public/js/DaoUsers.js');

let daoUsers = new DaoUsers(pool); 
//let daoQuestionAndAnswers = new DaoQuestionAndAnswer(pool);


usersRouter.get("/", (request, response) => {
    daoUsers.readAllUsers(function(error, allUsers){
        if(error){
            response.status(400);
            response.type("text/plain; charset=utf-8");
            response.end("Error al get users");
        } else{
            response.status(200);
            response.render("users", { users: allUsers });
        }
    });
});


module.exports = usersRouter;