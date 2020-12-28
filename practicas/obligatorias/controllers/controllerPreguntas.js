"use strict";

const DAOQuestions  = require('../models/modelPreguntas'); // DAOQuestions
const pool          = require("../database");
const { resolveInclude } = require('ejs');
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
                let params ={
                    questionID    : request.params.id,
                    user        : request.session.currentEmail
                };

                //buscar en la tabla visitas, para ver si ese user ya tenia algo 
                dao.checkUserVisits(params,function(error,result){
                    if(error){
                        response.status(200);
                        response.render("error_500");
                    }
                    else{                        
                        if(result[0].filas === 0){ // todavia no has visitado esa pregunta
                           
                            dao.updateVisits(params, function(error,resultado){
                                if(error){
                                    console.log("================================>", error.message);
                                    response.status(200);
                                    response.render("error_500");
                                }
                                else{                                   
                                    response.status(200);
                                    dao.filterQuestionByID(request.params.id, function(error, qData){
                                        if(error){
                                            response.status(200);
                                            response.render("error_500");
                                        } else{
                                            response.status(200);
                                            response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                                            response.end();
                                        }
                                    });
                                }
                            });
                        } else{
                            dao.filterQuestionByID(request.params.id, function(error, qData){
                                if(error){
                                    response.status(200);
                                    response.render("error_500");
                                } else{
                                    response.status(200);
                                    console.log(qData);
                                    response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                                    response.end();
                                }
                            });
                        }
                    }
                });               
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

    //
    likeAQuestion: function(request,response){
        let params = {
            questionID    : request.params.id,
            user        : request.session.currentEmail,
            type        : 1
        };
        
        // hay que ver si esa pregunta ya tiene un dislike, si ya le diste like salta error
        dao.checkQuestionStatus(params, function(error, results){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                response.status(200);
                //LO DISTINGO PQ SI LE DAS LIKE A UNA PREGUNTA QUE YA LO TIENE SE QUEDA COLGAO
                if(results[0].filas >0 && results[0].tipo == 0){ // ya existe y es dislike hacer un UPDATE
                    dao.updateLikeDislikeAQuestion(params,function(error){
                        if (error){
                            response.status(200);
                            response.render("error_500");
                        }else{
                            response.status(200);
                            //SI NO LLAMO ALs OTRO DAO NO SE ACTUALIZA LA INFORMACION !!!!!!
                            //response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                            dao.filterQuestionByID(request.params.id, function(error, qData){
                                if(error){
                                    response.status(200);
                                    response.render("error_500");
                                } else{
                                    response.status(200);
                                    response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                                    response.end();
                                }
                            });
                        }
                    });
                    
                }
                else if(results[0].filas >0 && results[0].tipo == 1){ // si es del mismo tipo renderizo la pagina otra vez
                    dao.filterQuestionByID(request.params.id, function(error, qData){
                        if(error){
                            response.status(200);
                            response.render("error_500");
                        } else{
                            response.status(200);
                            response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                            response.end();
                        }
                    });
                }
                else{ // si no tiene like
                    console.log("No tiene nada, le da like");
                    dao.likeDislikeAQuestion(params,function(error,qData){
                        if(error){
                            //console.log("==============================================>",error.message);
                            response.status(200);
                            response.render("error_500");
                        }else{
                            response.status(200);
                            //SI NO LLAMO AL OTRO DAO NO SE ACTUALIZA LA INFORMACION !!!!!!
                            //response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                            dao.filterQuestionByID(request.params.id, function(error, qData){
                                if(error){
                                    response.status(200);
                                    response.render("error_500");
                                } else{
                                    response.status(200);
                                    response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                                    response.end();
                                }
                            });
                                            
                        }
                    });
                }

            }
        });        
    },

    dislikeAQuestion: function(request,response){
        let params = {
            questionID    : request.params.id,
            user        : request.session.currentEmail,
            type        : 0
        };

        dao.checkQuestionStatus(params, function(error, results){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                console.log(results);
                response.status(200);
                //LO DISTINGO PQ SI LE DAS DISLIKE A UNA PREGUNTA QUE YA LO TIENE SE QUEDA COLGAO
                if(results[0].filas >0 && results[0].tipo == 1){ // ya existe y es like hacer un UPDATE
                    dao.updateLikeDislikeAQuestion(params,function(error){
                        if (error){
                            response.status(200);
                            response.render("error_500");
                        }else{
                            response.status(200);
                            //SI NO LLAMO AL OTRO DAO NO SE ACTUALIZA LA INFORMACION !!!!!!
                            //response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                            dao.filterQuestionByID(request.params.id, function(error, qData){
                                if(error){
                                    response.status(200);
                                    response.render("error_500");
                                } else{
                                    response.status(200);
                                    response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                                    response.end();
                                }
                            });
                        }
                    });
                    
                }
                else if(results[0].filas >0 && results[0].tipo == 0){ // si es del mismo tipo renderizo la pagina otra vez
                    dao.filterQuestionByID(request.params.id, function(error, qData){
                        if(error){
                            response.status(200);
                            response.render("error_500");
                        } else{
                            response.status(200);
                            response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                            response.end();
                        }
                    });
                }
                else{ // si no tiene Dislike
                    dao.likeDislikeAQuestion(params,function(error,qData){
                        if(error){
                            //console.log("==============================================>",error.message);
                            response.status(200);
                            response.render("error_500");
                        }else{
                            response.status(200);
                            //SI NO LLAMO AL OTRO DAO NO SE ACTUALIZA LA INFORMACION !!!!!!
                            //response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                            dao.filterQuestionByID(request.params.id, function(error, qData){
                                if(error){
                                    response.status(200);
                                    response.render("error_500");
                                } else{
                                    response.status(200);
                                    response.render("detailedQuestion", { question: qData.question, answers: qData.answers });
                                    response.end();
                                }
                            });
                                            
                        }
                    });
                }

            }
        });         
            
    }
}