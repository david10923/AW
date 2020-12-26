"use strict";

const express           = require('express');
const questionsRouter   = express.Router();
const controller        = require('../controllers/controllerPreguntas');
const bodyParser        = require('body-parser');

// middleware
questionsRouter.use(bodyParser.urlencoded({ extended: false }));

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

// Vistas
questionsRouter.get("/", checkSession, controller.getAllQuestions);
questionsRouter.get("/etiquetas/:label", checkSession, controller.findByTag);
questionsRouter.get("/formular", checkSession, controller.formulate);

// Forms/acciones de las vistas
questionsRouter.get("/buscar", checkSession, controller.findByFilter);
questionsRouter.post("/formulateQuestion", checkSession, controller.formulateQuestion);

questionsRouter.use(middlewareNotFoundError); // middleware ERROR 404
questionsRouter.use(middlewareServerError); // middleware ERROR 500

module.exports = questionsRouter;