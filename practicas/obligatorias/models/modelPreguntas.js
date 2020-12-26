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
    readAllQuestion(callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                let sql1 = "SELECT q.ID, q.user, q.title, q.body, q.date, u.username, u.profileImg as userImg FROM questions q JOIN users u ON q.user=u.email WHERE q.user=u.email ORDER BY q.date DESC;";
                let sql2 = "SELECT t.tagName, t.question FROM tags t JOIN questions q WHERE q.ID=t.question;";
                let sql = sql1 + sql2;
                connection.query(sql, function(error, results, fields){
                    connection.release();
                    if(error){
                        callback(error);
                    } else{
                        let questions   = {},
                            response    = [];
                        // Formateamos nuestro objeto
                        results[0].forEach(function(question){
                            question.tags = [];
                            questions[question.ID] = question;
                        });
                        results[1].forEach(function(tag){
                            questions[tag.question].tags.push(tag.tagName);
                        });
                        
                        // Formateamos la salida
                        for (const [ k, v ] of Object.entries(questions)) {
                            response.push(v);
                        }
                        // console.log(response);
                        callback(false, { totalQuestions: response.length, questions: response });
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