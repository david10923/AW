"use strict";

class DAOUsers{
    constructor(pool){
        this.pool = pool;
    }
    
    isUserCorrect(email, password, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT * FROM user WHERE email = ? AND password = ?" , [ email, password ], function(err, rows){
                    connection.release(); // devolver al pool la conexión
                    if (err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(rows.length === 0){
                            callback(null, false); //no está el usuario con el password proporcionado
                        }
                        else{
                            callback(null, true);
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
                connection.query("SELECT img as imageName FROM user WHERE email = ?", [ email ], function(error, result){
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