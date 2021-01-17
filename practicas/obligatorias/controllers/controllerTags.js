"use strict";

const DAOTags   = require('../models/modelTags'); // DAOTags
const pool      = require("../database");
let dao         = new DAOTags(pool);

module.exports = {
    // Obtener todas las etiquetas
    getAllTags: function(request, response){
        dao.getAllTags(function(error, data){
            if(error){
                response.status(500);
                response.render("error_500");
            } else{
                response.render("tags", { tags : data });
            }
        });
    },

    // Form filter
    findByName: function(request, response){
        dao.findByName(`%${request.query.tag}%`, function(error, data){
            if(error){
                response.status(500);
                response.render("error_500");
            } else{
                response.render("tags", { tags : data });
            }
        });
    }
}