"use strict";

const path          = require('path');
const { nextTick } = require('process');
const pool          = require("../database");
const DAOMensajes      = require('../models/modelsMensajes');
let daoMensajes        = new DAOMensajes(pool);
const middlewares       = require('../middlewares');
// probando la nueva config

module.exports ={

    getAllMessages: function(request, response,next){
        let usuarioDestino = request.params.user;
        daoMensajes.readAllMessages(usuarioDestino,function(error, allUsers){
            if(error){
               next(error);
            } else{
                response.render("mensajes", {usuarios :allUsers});
            }
        });
    },

    // LEER TODOS LOS MENSAJES DE UN USUARIO
    readuserMensajes: function(request, response,next){
        let usuarioDestino = request.session.currentEmail;        
        daoMensajes.readUserFriends(usuarioDestino,function(error, data){
            if(error){
               next(error);
            } else{
                response.render("enviarMensajes", {usuarios : data.usuarios ,info:data.session});
            }
        });
    },


    // PARA ENVIAR LOS MENSAJES E INSERTARLO EN LA BD
    enviarMensaje: function(request, response,next){
       
        let info= {
            usuarioOrigen   :request.session.currentEmail,
            usuarioDestino  :request.body.usuarioDestino,
            mensaje         :request.body.mensaje
        };
        daoMensajes.enviarMensaje(info,function(error, data){
            if(error){
               next(error);
            } else{                
                response.redirect("/mensajes/crearMensaje")
            }
        });
    },




}