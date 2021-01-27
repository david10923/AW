"use strict"

const moment = require('moment'); // Formatear fechas

class DAOMessages{

    constructor(pool){
        this.pool = pool;
    }

    // ORDENAR CRONOLOGICAMENTE
    getUserMessages(userID, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                let sql = 'SELECT m.ID as msgID, m.emisor, m.message, m.date, u.username, u.profileImg as img, u.ID as userID FROM messages m JOIN users u WHERE u.id=m.emisor AND m.receptor=? ORDER BY m.date ASC;';
                connection.query(sql, [ userID ], function(error, data){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        data.forEach(function(message){
                            message.date = moment(message.date).format('DD-M-YYYY H:mm:ss');
                        });
                        callback(null, data);
                    }
                });
            }
        });
    }

    // ORDENAR USUARIOS ALFABETICAMENTE
    sendMessage(actualUser, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                // Sacar todos los usuarios menos el que esta logueado
                let sql = 'SELECT id, username, profileImg as img FROM users WHERE ID <> ? ORDER BY username ASC;';
                connection.query(sql, [ actualUser ], function(error, data){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(null, data);
                    }
                });
            }
        });
    }

    postMessage(params, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                let sql = 'INSERT INTO messages (emisor, receptor, message) VALUES (?,?,?);';
                connection.query(sql, [ params.origen, params.destino, params.message ], function(error, data){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(null);
                    }
                });
            }
        });
    }

    deleteMessage(msgID, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                let sql = 'DELETE FROM messages WHERE ID=?;';
                connection.query(sql, [ msgID ], function(error, data){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(null);
                    }
                });
            }
        });
    }
}

module.exports = DAOMessages;