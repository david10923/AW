"use strict"

class DAOTags{

    constructor(pool){
        this.pool = pool;
    }

    getAllTags(callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                connection.query("SELECT DISTINCT(tagName) as name, COUNT(*) as times FROM `tags` GROUP BY tagName;", function(error, result){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(null, result);
                    }
                });
            }
        });
    }

    findByName(tag, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                connection.query("SELECT tagName as name, COUNT(*) as times FROM `tags` WHERE tagName LIKE ?", [ tag ], function(error, result){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(null, result);
                    }
                });
            }
        });
    }
}

module.exports = DAOTags;