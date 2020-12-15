"use strict";

const DAOUsers  = require('../models/modelUsuarios'); // DAOUsers
const pool      = require("../database");
let dao         = new DAOUsers(pool);

module.exports = {
    // Ruta: /usuarios/
    getAllUsers : function(request, response){
        dao.readAllUsers(function(error, allUsers){
            if(error){
                response.status(400);
                response.render("error");
            } else{
                response.status(200);
                response.render("users", { users: allUsers });
            }
        });
    }
};