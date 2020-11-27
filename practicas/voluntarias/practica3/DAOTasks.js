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
                var queryStr = `SELECT t.id, t.text, tg.tag, t.done FROM task t LEFT JOIN tag tg ON t.id=tg.taskId WHERE t.user=?`;
                connection.query(queryStr, [ email ], (error, array) =>{
                    connection.release(); // devolver al pool la conexión
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(array.length){
                            // Formateamos la salida
                            console.log('RAW OUTPUT: ', array);
                            var resultado = [];

                            callback(null, resultado);
                        }
                        else{
                            callback(null, false); // el usuario no tiene tareas
                        }
                    }
                });
            }
        });
    }

    insertTask(email, task, callback){

    }

    markTaskDone(idTask, callback){

    }

    deleteCompleted(email, callback){

    }
}

module.exports = DAOTasks;