"use strict";

const middlewares   = require('../middlewares');
const express       = require('express');
const tagsRouter    = express.Router();
const controller    = require('../controllers/controllerTags');
const bodyParser    = require('body-parser');

// middleware
tagsRouter.use(middlewares.checkSession);


// Rutas
tagsRouter.get("/", controller.getAllTags);
tagsRouter.get("/busqueda", controller.findByName);


tagsRouter.use(middlewares.middlewareNotFoundError); // middleware ERROR 404
tagsRouter.use(middlewares.middlewareServerError); // middleware ERROR 500

module.exports = tagsRouter;