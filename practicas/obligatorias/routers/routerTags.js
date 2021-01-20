"use strict";

const middlewares       = require('../middlewares');
const express           = require('express');
const tagsRouter        = express.Router();
const controller        = require('../controllers/cotrollerTags');
const bodyParser        = require('body-parser');

// middleware
tagsRouter.use(bodyParser.urlencoded({ extended: false }));
tagsRouter.use(middlewares.checkSession);

// Vistas y forms/acciones de las vistas
tagsRouter.get("/",controller.getAllTags);// para coger todas las etiquetas de la vista
tagsRouter.get("/popular",controller.getPopular);
tagsRouter.get("/nuevo",controller.getNew)
tagsRouter.get("/nombre")



tagsRouter.use(middlewares.middlewareNotFoundError); // middleware ERROR 404
tagsRouter.use(middlewares.middlewareServerError); // middleware ERROR 500

module.exports = tagsRouter;