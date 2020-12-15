"use strict";

const express           = require('express');
const questionsRouter   = express.Router();
const controller        = require('../controllers/controllerPreguntas');

questionsRouter.get("/", controller.getAllQuestions);

module.exports = questionsRouter;