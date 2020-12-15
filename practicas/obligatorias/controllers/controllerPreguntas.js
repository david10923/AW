"use strict";

const DAOQuestions  = require('../models/modelPreguntas'); // DAOQuestions
const pool          = require("../database");
let dao             = new DAOQuestions(pool);

module.exports = {
    // Ruta: /preguntas/
    getAllQuestions : function(request, response){
        dao.readAllQuestion(function(error, data){
            if(error){
                response.redirect('/error');
            } else{
                response.status(200);
                response.render("questions", { questions: data });
            }
        });
    }
}