"use strict"

class DAOQuestions{

    constructor(pool){
        this.pool = pool;
    }

    createQuestion(data, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{               
                connection.query("INSERT INTO `questions`(`user`, `title`, `body`) VALUES (?,?,?)", [ data.email, data.tittle, data.body ] , function(error, result){
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

    updateQuestion(){

    }
   
    readQuestion(){


    }
    // ORDENARLAS CRONOLOGICAMENTE
    // readAllQuestion(callback){
    //     this.pool.getConnection(function(error, connection){
    //         if(error){
    //             callback(new Error("Error de conexion a la base de datos"));
    //         } else{
    //             connection.query("SELECT q.`ID`, q.`user`, q.`title`, q.`body`, q.`date`, u.`username`, u.`profileImg` as userImg FROM `questions` q JOIN `users` u WHERE q.user=u.email ORDER BY date DESC", function(error, questions){
    //                 if(error){
    //                     callback(new Error("Error de acceso a la base de datos"));
    //                 } else{
    //                     // sacar los tags de la pregunta
    //                     questions.forEach(function(question){
    //                         question.tags = [];
    //                         connection.query("SELECT `tagName` as name FROM `tags` WHERE `question`=?", [ question.ID ], function(error, qTags){
    //                             if(error){
    //                                 callback(new Error("Error de acceso a la base de datos"));
    //                             } else{
    //                                 var aux = qTags.map(tag => tag.name);
    //                                 console.log('dentro', aux);
    //                             }
    //                         });
    //                         console.log('question', question.tags);
    //                     });
    //                     connection.release();
    //                     console.log('devuelvo callback');
    //                     callback(false, questions);
    //                 }
    //             });
    //         }
    //     });
    // }

    readAllQuestion(callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                let sql1= "SELECT q.ID, q.user, q.title, q.body, q.date, u.username, u.profileImg as userImg FROM questions q JOIN users u ON q.user=u.email WHERE q.user=u.email ORDER BY date DESC;";
                let sql2=  "SELECT tagName FROM tags;";
                let sql= sql1 +sql2;
                connection.query(sql, function(error, results, fields){
                    if(error){
                        callback(error);
                    } else{
                        console.log(results);
                        console.log(fields);
                        callback(false, 'xd');
                    }
                });
            }
        });
    }

    filterQuestionByTag(tagName, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{               
                connection.query("SELECT * FROM `questions` q JOIN `tags` t ON q.ID=t.question WHERE t.tagName=? AND t.question=q.ID", [ tagName ] , function(error, result){
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

    filterQuestionByAnswer(){


    }

    filterQuestionByText(){



    }

    createAnswer(data,callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{               
                connection.query("INSERT INTO `answers`(`user`, `question`) VALUES (?,?)",[data.email,data.id] , function(error, result){
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

    updateAnswer(){

    }

    readAnswer(){

    }

    readAllAnswers(){

    }

    deleteAnswer(){

    }

}

module.exports = DAOQuestions ;