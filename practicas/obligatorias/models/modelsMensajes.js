
"use strict"

const moment = require('moment'); // Formatear fechas

class DAOMensajes{
    constructor(pool){
        this.pool = pool;
    }

    readAllMessages(params,callback){
        this.pool.getConnection(function(error,connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            }else{
                let sql= "SELECT u.id, UserOrigin as usuarioOrigen , body , m.Date, u.profileImg as Img FROM mensajes m JOIN users u WHERE u.email=m.UserOrigin AND UserDest=?"
                connection.query(sql,[params],function(error,results){
                connection.release();
                    if(error){                       
                        callback(new Error("Error de acceso a la base de datos"));
                    }else{
                        results.forEach(result =>{
                            result.Date= moment(result.Date).format('YYYY-MM-DD HH:mm:ss');   
                        });   
                        callback(null,results);
                    }   
                });
            }
        });
       

    }
    readUserFriends(params,callback){
        this.pool.getConnection(function(error,connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            }else{
                let sql= '' ,sql1=''; 
                sql ="SELECT m.UserOrigin, u.profileImg FROM mensajes m JOIN users u WHERE u.email=m.UserOrigin AND m.UserDest=?;";
                sql1="SELECT data FROM sessions;";               
                connection.query(sql+sql1, [params ],function(error,results){
                connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    }else{
                        //console.log(results[0]);

                        let data={},aux={};
                        data.usuarios = results[0];
                        data.session =[];
                        results[1].forEach(session=>{
                            aux = JSON.parse(session.data);
                            if(!data.session.includes(aux.currentEmail)){
                                data.session.push(aux.currentEmail);
                            }
                           
                        });
                        callback(null,data);
                    }   
                });
            }
        });
    }

    enviarMensaje(params,callback){
        this.pool.getConnection(function(error,connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            }else{
                let sql = '',sql1='';                
                sql= "INSERT INTO mensajes(`UserOrigin`, `UserDest`, `Body`) VALUES (?,?,?);";
                connection.query(sql,[params.usuarioOrigen,params.usuarioDestino,params.mensaje],function(error,results){
                connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    }else{
                        callback(null);
                    }   
                });
            }
        });

    }

}


module.exports = DAOMensajes;