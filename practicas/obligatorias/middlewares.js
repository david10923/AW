"use strict"

const DAOUsers  = require('./models/modelUsuarios'); // DAOQuestions
const pool          = require("./database");
let dao             = new DAOUsers(pool);

module.exports = {
    checkSession: function(request, response, next){
        if (request.session.currentName !== undefined && request.session.currentEmail  !== undefined && request.session.currentID !== undefined && request.session.currentImg !== undefined) {
            response.locals.userName    = request.session.currentName;
            response.locals.userEmail   = request.session.currentEmail;
            response.locals.userID      = request.session.currentID;
            response.locals.userImg     = request.session.currentImg;
            next();
        } else {
            response.redirect("/loginout/login");
        }
    },

    middlewareCheckStatus: function(request, response, next){

        let data ={
            userName : request.session.currentEmail,
            questionId : request.params.id,
        };

        console.log("EL ID DE LA PREGUNTA ES ",data.questionId);
        dao.checkUserPermits(data,function(error,ok){
            if(error) {
                next(error);
            }else{
                if(!ok){
                    response.status(401);
                    response.render("error_de_permisos");
                }else{
                   next();
                }
            }

        });
        
    },

    middlewareNotFoundError: function(request, response, next){
        response.status(404);
        response.render("error_404");
    },
    
    middlewareServerError: function(error, request, response, next){
        response.status(500);
        console.log("==============>",error);
        response.render("error_500");
    }
}