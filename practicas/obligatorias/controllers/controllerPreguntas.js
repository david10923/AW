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

        dao.createQuestion(params, function(error){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                response.status(200);
                response.redirect("/");
            }
        });
    },

    // Ruta: /preguntas/:id vista especifica de cada pregunta
    getQuestion: function (request, response){
        // INCREMENTAR EN 1 EL NUMERO DE VISITAS A LA PREGUNTA PARA EL USUARIO ACTUAL SI NO LA HA VISITADO ANTES
        dao.filterQuestionByID(request.params.id, function(error, qData){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                // console.log(JSON.stringify(qData));
                response.status(200);
                response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                response.end();
            }
        });
    },

    // Ruta: /preguntas/publicarRespuesta/:id para publicar una respuesta dentro de la vista de una pregunta
    postAnswer: function(request, response){
        let params = {
            question    : request.params.id,
            text        : request.body.a_body,
            user        : request.session.currentEmail
        };
        console.log(params);
        dao.postAnswer(params, function(error){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                response.status(200);
                response.redirect("/preguntas");
            }
        });
    }
}