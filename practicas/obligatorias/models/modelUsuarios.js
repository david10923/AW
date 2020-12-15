"use strict"

class DAOUsers{

    constructor(pool){
        this.pool = pool;
    }

    createUser(data, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                data.profileImg = data.profileImg || 'resources/images/default.png';
                connection.query("INSERT INTO `users`(`email`, `username`, `password`, `profileImg`) VALUES (?, ?, ?, ?)", [ data.email, data.username, data.password, data.profileImg ], function(error, result){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(false, result);
                    }
                });
            }
        });

    }

    readUser(email, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                connection.query("SELECT username, profileImg as img, date FROM users WHERE email=?", [ email ], function(error, result){
                    connection.realease();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(false, result);
                    }
                });
            }
        });
    }

    readAllUsers(callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                connection.query("SELECT username, profileImg as img, totalScore as rep FROM users", function(error, result){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(false, result);
                    }
                });
            }
        });
        
    }
}

module.exports = DAOUsers;