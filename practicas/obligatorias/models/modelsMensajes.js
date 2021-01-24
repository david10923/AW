
"use strict"

const moment = require('moment'); // Formatear fechas

class DAOMensajes{
    constructor(pool){
        this.pool = pool;
    }

    readAllMessages(callback){
        this.pool.getConnection(function(error,connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            }else{
                connection.query(,[],function(error,results){
                connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    }else{
                        callback(null,results);

                    }   
                });
            }
        });
       

    }

}


module.exports = DAOMensajes;