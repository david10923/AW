"use strict"

const moment = require('moment'); // Formatear fechas

class DAOMessages{

    constructor(pool){
        this.pool = pool;
    }

    getUserMessages(userID, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                let sql1 = 'SELECT m.ID as msgID, m.emisor, m.message, m.date, u.username, u.profileImg as img, u.ID as userID FROM messages m JOIN users u WHERE u.id=m.emisor AND m.receptor=?;';
                connection.query(sql1, [ userID ], function(error, data){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        data.forEach(function(message){
                            message.date = moment(message.date).format('YYYY-MM-DD HH:mm:ss');
                        });
                        callback(null, data);
                    }
                });
            }
        });
    }

    sendMessage(actualUser, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                // Sacar todos los usuarios menos el que esta logueado
                let sql1 = 'SELECT id, email, username, profileImg as img FROM users WHERE ID <> ?;';
                let sql2 = 'SELECT data FROM sessions;';
                connection.query(sql1 + sql2, [ actualUser ], function(error, data){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        let users       = data[0],
                            usersOnline = [];
                        data[1].forEach(function(session){
                            let userID = JSON.parse(session.data).currentID;
                            if(usersOnline.indexOf(userID) == -1){
                                usersOnline.push(userID);
                            }
                        });
                        users.forEach(function(user){
                            user.status = usersOnline.includes(user.id) ? 'online' : 'offline';
                        });
                        callback(null, users);
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
                        callback(null, data);
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