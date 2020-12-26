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
                data.profileImg = data.profileImg || '/resources/images/default.png';
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

    isUserCorrect(email, password, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT * FROM users WHERE email = ? AND password = ?" , [ email, password ], function(err, rows){
                    connection.release(); // devolver al pool la conexión
                    if (err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(rows.length === 0){
                            callback(null, null); // no está el usuario con el password proporcionado
                        }
                        else{
                            rows = rows[0];
                            callback(null, { username: rows.username, email: rows.email });
                        }
                    }
                });
            }
        });
    }
    getUserImageName(email, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT profileImg as imageName FROM users WHERE email=?", [ email ], function(error, result){
                    connection.release(); // devolver al pool la conexión
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        if(result.length > 0){
                            result = result[0];
                            callback(null, result.imageName);
                        } else{
                            callback(null, null); // el usuario no tiene imagen
                        }
                    }
                });
            }
        });
    }
}

module.exports = DAOUsers;