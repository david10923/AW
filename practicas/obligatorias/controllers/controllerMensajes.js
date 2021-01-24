"use strict";

const path          = require('path');
const { nextTick } = require('process');
const pool          = require("../database");
const DAOMensajes      = require('../models/modelsMensajes');
let daoMensajes        = new DAOMensajes(pool);
// probando la nueva config

module.exports ={

    getAllMessages: function(request, response){
        dao.readMensajes(function(error, allUsers){
            if(error){
               next(error);
            } else{
                response.render("mensajes", { });
            }
        });
    },

}