const express = require('express');
const loginRouter = express.Router();
const path = require('path');
const pool = require("../database");
const DAOUsers = require('../models/modelUsuarios');
const bodyParser        = require('body-parser');
let daoUsers = new DAOUsers(pool);

// middleware
loginRouter.use(bodyParser.urlencoded({ extended: false }));

loginRouter.get("/registro", (request, response) => {
    response.status(200);
    response.sendFile(path.join(__dirname, '../public/register.html'));
});

loginRouter.get("/login", (request, response) => {
    response.status(200);
    response.sendFile(path.join(__dirname, '../public/login.html'));
});

loginRouter.post("/registrarUsuario", function (request, response) {
    let data = {
        email       :request.body.email,
        username    :request.body.username,
        password    :request.body.password,
        password_c  :request.body.password_confirm,
        profileImg  :request.body.img
    };

    if(data.password === data.password_c){
        daoUsers.createUser(data, function (error) {
            if (error) {
                response.status(400);
                response.render("error");
            } else {
                response.status(200);
                response.redirect("/loginout/login");
            }
        });
    } else{
        response.status(200);
        response.redirect("/loginout/registro");
    }
});


module.exports = loginRouter;