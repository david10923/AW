"use strict";

const express       = require('express');
const usersRouter   = express.Router();
const controller    = require('../controllers/controllerUsuarios');

function checkSession(request, response, next){
    if (request.session.currentName !== undefined && request.session.currentEmail !== undefined && request.session.currentID !== undefined) {
        response.locals.userName    = request.session.currentName;
        response.locals.userEmail   = request.session.currentEmail;
        response.locals.userID      = request.session.currentID;
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

// Vistas y acciones
usersRouter.get("/", checkSession, controller.getAllUsers);
usersRouter.get("/filtrar", checkSession, controller.findByFilter);
usersRouter.get("/perfil/:id", checkSession, controller.findByID);

usersRouter.use(middlewareNotFoundError); // middleware ERROR 404
usersRouter.use(middlewareServerError); // middleware ERROR 500

module.exports = usersRouter;