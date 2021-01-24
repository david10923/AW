"use strict";

const middlewares       = require('../middlewares');
const express           = require('express');
const mensajesRouter    = express.Router();
const controller        = require('../controllers/controllerMensajes');
const bodyParser        = require('body-parser');
const multer            = require('multer');
const path              = require('path');
//const multerFactory     = multer({ dest : path.join(__dirname, "../uploads") }); // Otro codificador de forms como body-parser pero para imagenes

// middleware
mensajesRouter.use(bodyParser.urlencoded({ extended: false }));

mensajesRouter.use(middlewares.checkSession);
// Vistas
mensajesRouter.get("/", controller.getAllMessages);



mensajesRouter.use(middlewares.middlewareNotFoundError); // middleware ERROR 404
mensajesRouter.use(middlewares.middlewareServerError); // middleware ERROR 500

module.exports = mensajesRouter;