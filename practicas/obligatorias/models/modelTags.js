"use strict"

const moment = require('moment'); // Formatear fechas

class DAOTags{

    constructor(pool){
        this.pool = pool;
    }

    readAllTags(callback){
        this.pool.getConnection(function(error,connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            }else{
                let sql = '';
                sql = "SELECT COUNT(t.question)as number, t.tagName as name  FROM `tags` t GROUP BY t.tagName";
                connection.query(sql,function(error,result){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    }else{                  
                        callback(null,result);
                    }
                });

            }


        });

    }

    readPopularTags(callback){
        this.pool.getConnection(function(error,connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            }else{
                let sql = '';
                sql = "SELECT COUNT(t.question)as number, t.tagName as name  FROM `tags` t GROUP BY t.tagName ORDER BY number DESC ";
                connection.query(sql,function(error,result){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    }else{                  
                        callback(null,result);
                    }
                });

            }


        });

    }

    readNewTags(callback){
        this.pool.getConnection(function(error,connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            }else{
                let sql = '';
                sql = "SELECT t.tagName as name, t.question as questionID, q.date as date FROM tags t JOIN questions q WHERE q.ID=t.question ORDER BY q.date ASC;";
                connection.query(sql,function(error,result){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    }else{  
                        //console.log(result);
                       callback(null,result);
                    }
                });

            }

        });
    }

    
}

module.exports = DAOTags;