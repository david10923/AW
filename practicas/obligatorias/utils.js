"use strict"

const DAOUsers  = require('./models/modelUsuarios'); // DAOUsers
const pool      = require("./database");
let dao         = new DAOUsers(pool);

module.exports = {
    getUsersOnline: function(callback){
        dao.getOnlineUsers(function(error, nUsers){
            callback(error ? 0 : nUsers);
        });
    }
};