"use strict";

const DAOTags  = require('../models/modelTags'); // DAOQuestions
const pool          = require("../database");
let dao             = new DAOTags(pool);

module.exports = {
    // Ruta: /preguntas/
    getAllTags : function(request, response){
        dao.readAllTags(function(error, data){
            if(error){
                console.log("=====>",error);
                response.status(500);
                response.render("error_500");
            } else{
                console.log(data);
                response.render("tags");
            }
        });
    },

}