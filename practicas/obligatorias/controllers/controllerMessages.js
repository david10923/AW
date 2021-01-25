"use strict";

const DAOMessages   = require('../models/modelMessages'); // DAOMessages
const pool          = require("../database");
let dao             = new DAOMessages(pool);

module.exports = {
    // Obtener todas los mensajes del usuario logueado
    getUserMessages: function(request, response, next){
        dao.getUserMessages(request.session.currentID, function(error, data){
            if(error){
                next(error);
            } else{
                response.render("messages", { messages : data });
            }
        });
    },

    // Pagina de enviar mensajes
    sendMessage: function(request, response, next){
        dao.sendMessage(request.session.currentID, function(error, data){
            if(error){
                next(error);
            } else{
                response.render("sendMessage", { users : data });
            }
        });
    },

    // Manda un mensaje a un usuario
    postMessage: function(request, response, next){
        let params = {
            origen  : request.session.currentID,
            destino : request.params.id,
            message : request.body.message
        };
        dao.postMessage(params, function(error, data){
            if(error){
                next(error);
            } else{
                response.redirect("/mensajes/enviar");
            }
        });
    },

    // Borra un mensaje
    deleteMessage: function(request, response, next){
        dao.deleteMessage(request.params.id, function(error, data){
            if(error){
                next(error);
            } else{
                response.redirect("/mensajes/");
            }
        });
    }
}