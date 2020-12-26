"use strict"

const path          = require('path');
const pool          = require("../database");
const DAOUsers      = require('../models/modelUsuarios');
let daoUsers        = new DAOUsers(pool);

module.exports = {
    // Ruta: /loginout/registro
    getRegisterRedirect: function(request, response){
        response.status(200);
        response.sendFile(path.join(__dirname, '../public/register.html'));
    },

    // Ruta: /loginout/login
    getLoginRedirect: function(request, response){
        response.status(200);
        response.render("login", { errorMsg : null });
        //response.end();
    },

    // Ruta: POST a la bbdd del register
    registerUser: function(request, response){
        let data = {
            email       : request.body.email,
            username    : request.body.username,
            password    : request.body.password,
            password_c  : request.body.password_confirm,
            profileImg  : request.body.img
        };
    
        if(data.password === data.password_c){
            daoUsers.createUser(data, function (error) {
                if (error) {
                    response.status(200);
                    response.render("error_500");
                    response.end();
                } else {
                    response.status(200);
                    response.redirect("/loginout/login");
                }
            });
        } else{
            response.status(200);
            response.redirect("/loginout/registro");
        }
    },

    // Ruta: POST a la bbdd para iniciar la sesion
    loginUser: function(request, response){
        daoUsers.isUserCorrect(request.body.email, request.body.password, function(error, user){
            if(error){
                console.log("========================== ERROR ==========================", error.message);
            } else if(user !== undefined){
                request.session.currentName = user.username;
                request.session.currentEmail = user.email;
                response.redirect("/index");
            } else{
                response.status(200);
                response.render("login", { errorMsg : "Direccion de correo y/o contraseña no válidos" });
            }
        });
    },
    // Ruta: POST /loginout/logoutUser
    logoutUser: function(request, response){
        request.session.destroy();
        response.redirect("/loginout/login");
    },

    // Ruta: para cogerla imagen del user /userImage
    userImage: function(request, response){
        daoUsers.getUserImageName(response.locals.userEmail, function(error, img){
            if(error){
                console.log("========================== ERROR ==========================", error.message);
            } else if(img != '/resources/images/default.png'){
                response.sendFile(path.join(__dirname, img));
            } else{
                response.sendFile(path.join(__dirname, "../public/resources/images/default.png"));
            }
        });
    }
}