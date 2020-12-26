"use strict";

const express           = require('express');
const loginRouter       = express.Router();
const controller        = require('../controllers/controllerLogin');
const bodyParser        = require('body-parser');

// middleware
loginRouter.use(bodyParser.urlencoded({ extended: false }));

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

// Vistas
loginRouter.get("/registro", controller.getRegisterRedirect);
loginRouter.get("/login", controller.getLoginRedirect);

// Forms/acciones de las vistas
loginRouter.post("/registrarUsuario", controller.registerUser);
loginRouter.post("/loginUser", controller.loginUser);
loginRouter.get("/logoutUser", checkSession, controller.logoutUser);
loginRouter.get("/userImage", checkSession, controller.userImage);



loginRouter.use(middlewareNotFoundError); // middleware ERROR 404
loginRouter.use(middlewareServerError); // middleware ERROR 500

module.exports = loginRouter;