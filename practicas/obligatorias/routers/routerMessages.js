"use strict";

const middlewares       = require('../middlewares');
const express           = require('express');
const messagesRouter    = express.Router();
const controller        = require('../controllers/controllerMessages');
const bodyParser        = require('body-parser');

// middleware
messagesRouter.use(middlewares.checkSession);
messagesRouter.use(bodyParser.urlencoded({ extended: false }));


// Rutas
messagesRouter.get("/", controller.getUserMessages);
messagesRouter.get("/enviar", controller.sendMessage);
messagesRouter.post("/postMessage/:id", controller.postMessage);
messagesRouter.post("/borrar/:id", controller.deleteMessage);


messagesRouter.use(middlewares.middlewareNotFoundError); // middleware ERROR 404
messagesRouter.use(middlewares.middlewareServerError); // middleware ERROR 500

module.exports = messagesRouter;