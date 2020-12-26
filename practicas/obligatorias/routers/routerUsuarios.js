"use strict";

const express       = require('express');
const usersRouter   = express.Router();
const controller    = require('../controllers/controllerUsuarios');

function checkSession(request, response, next){
    if (request.session.currentName !== undefined && request.session.currentEmail !== undefined) {
        response.locals.userName = request.session.currentName; // SOLO para tener el email accesible es los EJS
        response.locals.userEmail = request.session.currentEmail;
        next();
    } else {
        response.redirect("/loginout/login");
    }
}
function middlewareNotFoundError(request, response, next){
    response.status(200);
    response.render("error_404");
}
function middlewareServerError(error, request, response, next){
    response.status(200);
    response.render("error_500");
}

usersRouter.get("/", checkSession, controller.getAllUsers);

usersRouter.use(middlewareNotFoundError); // middleware ERROR 404
usersRouter.use(middlewareServerError); // middleware ERROR 500

module.exports = usersRouter;