const express = require('express');
const usersRouter = express.Router();
const pool = require("../database");
const DAOUsers = require('../models/modelUsuarios');

let daoUsers = new DAOUsers(pool); 

usersRouter.post("/registro", (request, response) => {
    daoUsers.createUser({email:"info2@ucm.es",password:"123",username:"Casa de estudiantes 2",profileImg:"resources/images/default.png"}, function(error){
        if(error){
            response.status(400);
            response.render("error");
        } else{
            response.status(200);
            response.redirect("/login");
        }
    });
});

usersRouter.post("/login", (request, response) => {
    daoUsers.readUser("csegundo@ucm.es", function(error){
        if(error){
            response.status(500);
            response.render("error");
        } else{
            response.status(200);
            response.redirect("/");
        }
    });
});


module.exports = usersRouter;