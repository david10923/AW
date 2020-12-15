"use strict";

const express       = require('express');
const usersRouter   = express.Router();
const controller    = require('../controllers/controllerUsuarios');

usersRouter.get("/", controller.getAllUsers);

module.exports = usersRouter;