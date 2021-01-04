"use strict";

const express           = require('express');
const loginRouter       = express.Router();
const controller        = require('../controllers/controllerLogin');
const bodyParser        = require('body-parser');
const multer            = require('multer');
const path              = require('path');
const multerFactory     = multer({ dest : path.join(__dirname, "../uploads") }); // Otro codificador de forms como body-parser pero para imagenes

// middleware
loginRouter.use(bodyParser.urlencoded({ extended: false }));

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
loginRouter.get("/registro", controller.getRegisterRedirect);
loginRouter.get("/login", controller.getLoginRedirect);

// Forms/acciones de las vistas
loginRouter.post("/registrarUsuario", multerFactory.single("img"), controller.registerUser);
loginRouter.post("/loginUser", controller.loginUser);
loginRouter.get("/logoutUser", checkSession, controller.logoutUser);
loginRouter.get("/userImage", checkSession, controller.userImage);


loginRouter.use(middlewareNotFoundError); // middleware ERROR 404
loginRouter.use(middlewareServerError); // middleware ERROR 500

module.exports = loginRouter;