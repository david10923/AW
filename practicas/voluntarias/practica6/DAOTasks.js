"use strict";

class DAOTasks{
    constructor(pool){
        this.pool = pool;
    }

    getAlltasks(email, callback){
        this.pool.getConnection((error, connection) => {
            if(error){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{               
                var queryStr = `SELECT t.id, t.text, tg.tag as tags, t.done FROM task t LEFT JOIN tag tg ON t.id=tg.taskId WHERE t.user=?`;
                connection.query(queryStr, [ email ], (error, array) =>{
                    connection.release(); // devolver al pool la conexión
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(array.length){
                            // Formateamos la salida
                            var resultado   = [],
                                tasks       = {};
                            
                            array.forEach(element => {
                                if(tasks[element.id]){
                                    if(element.tags){
                                        tasks[element.id].tags.push(element.tags);
                                    }
                                }
                                else{
                                    tasks[element.id] = {};
                                    for (const [ k, v ] of Object.entries(element)) {
                                        //console.log(`KEY: ${k} - VALUE: ${v}`);
                                        tasks[element.id][k] = v;

                                        if(k == 'tags'){
                                            tasks[element.id][k] = [];
                                            if(v)
                                                tasks[element.id][k].push(v);
                                        }
                                    }
                                }
                            });
                            
                            for (const [ k, v ] of Object.entries(tasks)) {
                                resultado.push(v);
                            }

                            callback(null, resultado);
                        }
                        else{
                            callback(null, []); // el usuario no tiene tareas
                        }
                    }
                });
            }
        });
    }

    insertTask(email, task, callback){
        this.pool.getConnection((error, connection) => {
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                // check if user exists
                /*var queryStr = 'SELECT COUNT(email) FROM user WHERE email=?';
                connection.query(queryStr, [ email ], function(error, info){
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    }else{
                        if(info > 0){
                            //hacer lo que hay debajo
                            console.log(info);
                        } else{
                            callback(new Error("No existe el usuario"));
                        }
                    }
                });*/

                var queryStr = 'INSERT INTO task(user, text, done) VALUES (?, ?, ?)';
                connection.query(queryStr, [ email, task.text, task.done ], function(error, resultTask){
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(task.tags.length > 0){
                            task.tags.forEach(tag => {
                                queryStr = 'INSERT INTO tag(taskId, tag) VALUES (?, ?)';
                                connection.query(queryStr, [ resultTask.insertId, tag ], (error, result) => {
                                    if(error){
                                        callback(new Error("Error de acceso a la base de datos"));
                                    }
                                });
                            });
                            if(!error){
                                callback(null);
                            }
                            connection.release(); // Devolvemos la conexion al POOL cuando hayamos hecho todos los inserts
                        } else{
                            connection.release();
                            callback(null);
                        }
                    }
                });
            }
        });
    }

    markTaskDone(idTask, callback){
        this.pool.getConnection( (err, connection) => {
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
               let queryStr = `UPDATE task SET done=true WHERE id=?`;  
                
                connection.query(queryStr, [ idTask ], (err) => {
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        callback(null);
                    }
                });
            }
        });
    }

    deleteCompleted(email, callback){
        this.pool.getConnection((err,connection) => {
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else{
                connection.query( `DELETE FROM task WHERE user=? AND done=true`,  [ email ], function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {

                        callback(null);
                    }
                });
            }
        });
    }
}

module.exports = DAOTasks;