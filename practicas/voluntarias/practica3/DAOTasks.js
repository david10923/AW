"use strict";

class DAOTasks{
    constructor(pool){
        this.pool = pool;
    }

    getAlltasks(email,callback){
        this.pool.getConnection( (error,connection) => {
            if(error){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{                
                connection.query("SELECT t.user,t.text, tg.tag,t.done FROM task t LEFT JOIN tag tg ON t.id = tg.taskId WHERE t.user ='?'", [email], (err,array) =>{
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(array.lenght){
                            callback(null,result);
                        }
                        else{
                            callback(null,false);// el usuario no tiene tareas
                        }
                    }
                })

            }
        }
        );
        
    }

    insertTask(email,task,callback){

    }

    markTaskDone(idTask,callback){

    }

    deleteCompleted(email,callback){

    }
}

module.exports = DAOTasks;