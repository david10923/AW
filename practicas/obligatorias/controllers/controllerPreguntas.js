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
        // console.log('=================', request.originalUrl);
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
        // console.log('=================', request.originalUrl);
        response.status(200);
        response.render("formulate", {});
        response.end();
    },

    // Ruta: POST /preguntas/createQuestion del FORM para crear la pregunta
    formulateQuestion: function(request, response){
        let labels = request.body.labels || '';
        labels = labels !== '' ?  labels.split("@") : [];           

        let params = {
            email   : request.session.currentEmail,
            title   : request.body.title,
            body    : request.body.body,
            tags    : labels
        };

        if(params.title === "" || params.body === ""){
            response.status(200);
            response.redirect("/preguntas/formular");
        } else{
            dao.createQuestion(params, function(error){
                if(error){
                    response.status(200);
                    response.render("error_500");
                } else{
                    response.status(200);
                    response.redirect("/preguntas");
                }
            });
        }
    },

    // Ruta: /preguntas/:id vista especifica de cada pregunta
    getQuestion: function (request, response){
        dao.filterQuestionByID({ question : request.params.id, user : request.session.currentEmail }, function(error, qData){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
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
    },

    // Ruta: /preguntas/like/:id o /preguntas/dislike/:id a una pregunta
    scoreQuestion: function(request, response){
        let like = request.originalUrl.split('/')[2] === 'like',
        params = {
            type        : like,
            question    : request.params.id,
            user        : request.session.currentEmail
        };
        dao.scoreQuestion(params, function(error){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                response.status(200);
                response.redirect(`/preguntas/${request.params.id}`);
            }
        });
    },

    // Ruta: /usuarios/descargar/sinreponder
    noAnswers: function(request, response){
        dao.noAnswers(function(error, data){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                response.status(200);
                response.render("questions", { questions: data.questions, total: data.questions.length, title: "Preguntas sin responder" });
                response.end();
            }
        });
    },

    // Ruta: /preguntas/respuestas/like/:idQ/:idA o /preguntas/respuestas/dislike/:id a una pregunta
    scoreAnswer: function(request, response){
        let like = request.originalUrl.split('/')[3] === 'like',
        params = {
            type        : like,
            answer      : request.params.idA,
            user        : request.session.currentEmail
        };
        
        dao.scoreAnswer(params, function(error){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                response.status(200);
                response.redirect(`/preguntas/${request.params.idQ}`);
            }
        });
    },
}