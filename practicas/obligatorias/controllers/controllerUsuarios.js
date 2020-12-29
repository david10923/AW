"use strict";

const DAOUsers  = require('../models/modelUsuarios'); // DAOUsers
const pool      = require("../database");
let dao         = new DAOUsers(pool);

module.exports = {
    // Ruta: /usuarios/
    getAllUsers : function(request, response){
        dao.readAllUsers(function(error, allUsers){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                response.status(200);
                response.render("users", { users: allUsers, title: 'Usuarios' });
                response.end();
            }
        });
    },

    // Ruta: /usuarios/filtrar por nombre de usuario
    findByFilter: function(request, response){
        dao.findByFilter(`%${request.query.filtro}%`, function(error, users){
            if(error){
                response.status(200);
                response.render("error_500");
            } else{
                response.status(200);
                response.render("users", { users: users, title: `Usuarios filtrados por ["${request.query.filtro}"]` });
                response.end();
            }
        });
    }
};