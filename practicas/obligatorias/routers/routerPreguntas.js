"use strict";

const express           = require('express');
const questionsRouter   = express.Router();
const controller        = require('../controllers/controllerPreguntas');
const bodyParser        = require('body-parser');

// middleware
questionsRouter.use(bodyParser.urlencoded({ extended: false }));

function checkSession(request, response, next){
    if (request.session.currentName !== undefined && request.session.currentEmail !== undefined && request.session.currentID !== undefined && request.session.currentImg !==undefined) {
        response.locals.userName    = request.session.currentName;
        response.locals.userEmail   = request.session.currentEmail;
        response.locals.userID      = request.session.currentID;
        response.locals.userImg     = request.session.currentImg;
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
    console.log("==================", error.message);
    response.status(200);
    response.render("error_500");
}

// Vistas y forms/acciones de las vistas
questionsRouter.get("/", checkSession, controller.getAllQuestions);
questionsRouter.get("/etiquetas/:label", checkSession, controller.findByTag);
questionsRouter.get("/formular", checkSession, controller.formulate);
questionsRouter.get("/buscar", checkSession, controller.findByFilter);
questionsRouter.get("/:id", checkSession, controller.getQuestion);
questionsRouter.post("/formulateQuestion", checkSession, controller.formulateQuestion);
questionsRouter.post("/publicarRespuesta/:id", checkSession, controller.postAnswer);
questionsRouter.get("/like/:id", checkSession, controller.scoreQuestion);
questionsRouter.get("/dislike/:id", checkSession, controller.scoreQuestion);
questionsRouter.get("/descargar/sinreponder", checkSession, controller.noAnswers);
questionsRouter.get("/respuestas/like/:idQ/:idA", checkSession,controller.scoreAnswer);
questionsRouter.get("/respuestas/dislike/:idQ/:idA", checkSession,controller.scoreAnswer);

questionsRouter.use(middlewareNotFoundError); // middleware ERROR 404
questionsRouter.use(middlewareServerError); // middleware ERROR 500

module.exports = questionsRouter;