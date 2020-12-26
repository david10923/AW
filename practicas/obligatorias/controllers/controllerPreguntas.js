"use strict";

const DAOQuestions  = require('../models/modelPreguntas'); // DAOQuestions
const pool          = require("../database");
let dao             = new DAOQuestions(pool);

module.exports = {
    // Ruta: /preguntas/
    getAllQuestions : function(request, response){
        dao.readAllQuestion(function(error, data){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                response.status(200);
                response.render("questions", { questions: data.questions, total: data.totalQuestions, title: 'Todas las preguntas' });
                response.end();
            }
        });
    },

    // Ruta: GET /preguntas/buscar en el filtro del header
    findByFilter: function(request, response){
        dao.findByFilter(`%${request.query.busqueda}%`, function(error, data){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                response.status(200);
                response.render("questions", { questions: data.questions, total: data.totalQuestions, title: `Resultados de la búsqueda "${request.query.busqueda}"` });
                response.end();
            }
        });
    },

    // Ruta: /preguntas/etiquetas/:label
    findByTag: function(request, response){
        dao.filterQuestionByTag(request.params.label, function(error, data){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                response.status(200);
                response.render("questions", { questions: data.questions, total: data.totalQuestions, title: `Preguntas con la etiqueta [${request.params.label}]` });
                response.end();
            }
        });
    },

    // Ruta: /preguntas/formular
    formulate: function(request, response){
        response.status(200);
        response.render("formulate", {});
        response.end();
    },

    // Ruta: POST /preguntas/createQuestion del FORM para crear la pregunta
    formulateQuestion: function(request, response){
        let labels = request.body.labels || '';
        labels = labels !== '' ? labels : [];
        let params = {
            email   : request.session.currentEmail,
            title   : request.body.title,
            body    : request.body.body,
            tags    : labels
        };
        console.log(params);

        dao.createQuestion(params, function(error){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                response.status(200);
                response.redirect("/");
            }
        });
    }
}