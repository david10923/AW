"use strict";

const express           = require('express');
const questionsRouter   = express.Router();
const controller        = require('../controllers/controllerPreguntas');

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

questionsRouter.get("/", checkSession, controller.getAllQuestions);

questionsRouter.use(middlewareNotFoundError); // middleware ERROR 404
questionsRouter.use(middlewareServerError); // middleware ERROR 500

module.exports = questionsRouter;