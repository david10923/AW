"use strict"

const { query } = require("express");

class DAOQuestions{

    constructor(pool){
        this.pool = pool;
    }

    createQuestion(data, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{               
                connection.query("INSERT INTO `questions`(`user`, `title`, `body`) VALUES (?,?,?)", [ data.email, data.title, data.body ] , function(error, result){
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        var questionID = result.insertId;
                        if(data.tags.length > 0){
                            let queryStr = "INSERT INTO tags ('question','tagName)", params = [];
                            for(var i = 0; i < data.tags.length; i++){
                                queryStr += ' VALUES (?, ?)';
                                params.push(questionID, data.tags[i]);
                                if(i != (data.tags.length - 1)){
                                    queryStr += ', ';
                                }
                            }
                            connection.query("queryStr", params, function(error, result){
                                if(error){
                                    connection.release();
                                    callback(new Error("Error de acceso a la base de datos"));
                                } else{
                                    connection.release();
                                    callback(null);
                                }
                            });
                        } else{
                            connection.release();
                            callback(null);
                        }
                    }
                });
            }
        });
    }

    // ORDENARLAS CRONOLOGICAMENTE
    readAllQuestion(callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                let sql1 = "SELECT q.ID, q.user, q.title, q.body, q.date, u.username, u.profileImg as userImg, u.id as userID FROM questions q JOIN users u ON q.user=u.email WHERE q.user=u.email ORDER BY q.date DESC;";
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
                let sql1 = "SELECT t.question FROM tags t JOIN questions q WHERE q.ID=t.question AND t.tagName=?;";
                let sql2 = "SELECT q.ID, q.user, q.title, q.body, q.date, u.username, u.profileImg as userImg, u.id as userID FROM questions q JOIN users u WHERE q.user=u.email ORDER BY q.date DESC;";
                let sql3 = "SELECT t.tagName, t.question FROM tags t JOIN questions q WHERE q.ID=t.question;";
                let sql = sql1 + sql2 + sql3;
                connection.query(sql, [ tagName ] , function(error, results){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        let tags        = {}, // todos los tags de cada pregunta
                            response    = []; // todas las preguntas
                        results[0].forEach(function(tag){
                            tags[tag.question] = [];
                        });
                        results[2].forEach(function(tag){
                            if(tags[tag.question]){
                                tags[tag.question].push(tag.tagName);
                            }
                        });
                        results[1].forEach(function(question){
                            if(tags[question.ID]){
                                question.tags = tags[question.ID];
                                response.push(question);
                            }
                        });

                        callback(false, { totalQuestions: response.length, questions: response });
                    }
                });
            }
        });

    }

    createAnswer(data, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                connection.query("INSERT INTO `answers`(`user`, `question`) VALUES (?,?)", [ data.email, data.id ] , function(error, result){
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

    findByFilter(text, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                let sql1 = "SELECT q.ID, q.user, q.title, q.body, q.date, u.username, u.profileImg as userImg, u.id as userID FROM questions q JOIN users u WHERE q.user=u.email AND (q.title LIKE ? OR q.body LIKE ?);";
                let sql2 = "SELECT t.tagName, t.question FROM tags t JOIN questions q WHERE q.ID=t.question;";
                let sql = sql1 + sql2;
                connection.query(sql, [ text, text ] , function(error, results){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        let questions   = {},
                            response    = [];
                        // Formateamos nuestro objeto
                        results[0].forEach(function(question){
                            question.tags = [];
                            questions[question.ID] = question;
                        });
                        results[1].forEach(function(tag){
                            if(questions[tag.question]){
                                questions[tag.question].tags.push(tag.tagName);
                            }
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


    filterQuestionByID(questionID, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                let sql1 = "SELECT q.ID as qID, q.title, q.body, q.date, q.visits, q.nLikes, q.nDislikes, u.ID as qUserID, u.profileImg, u.username FROM questions q JOIN users u WHERE q.user=u.email AND q.ID=?;";
                let sql2 = "SELECT t.tagName FROM tags t WHERE t.question=?;";
                let sql3 = "SELECT u.username as aUser, a.body, a.nLikes, a.nDislikes, a.date, u.ID as userID, u.profileImg FROM answers a JOIN users u WHERE a.user=u.email AND a.question=?;";
                let sql = sql1 + sql2 + sql3;
                connection.query(sql, [ questionID, questionID, questionID ], function(error, results){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        let q = results[0][0];
                        q.tags = [];
                        results[1].forEach(function(tag){ q.tags.push(tag.tagName); });
                        callback(null, { question: q, answers: results[2] });
                    }
                });
            }
        });
    }

    postAnswer(params, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{               
                connection.query("INSERT INTO answers(user, question, body) VALUES (?,?,?)", [ params.user, params.question, params.text ], function(error, results){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(null);
                    }
                });
            }
        });
    }

    

    likeDislikeAQuestion(params,callback){
        this.pool.getConnection(function(error,connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            }else{
                let sql1 = "SELECT q.ID as qID, q.title, q.body, q.date, q.visits, q.nLikes, q.nDislikes, u.ID as qUserID, u.profileImg, u.username FROM questions q JOIN users u WHERE q.user=u.email AND q.ID=?;";
                let sql2 = "SELECT t.tagName FROM tags t WHERE t.question=?;";
                let sql3 = "SELECT u.username as aUser, a.body, a.nLikes, a.nDislikes, a.date, u.ID as userID, u.profileImg FROM answers a JOIN users u WHERE a.user=u.email AND a.question=?;";
                let sql4=  "INSERT INTO questions_score(question,user,type) VALUES (?,?,?)"
                let sql = sql1 + sql2 + sql3 + sql4;
                connection.query(sql,[params.questionID, params.questionID, params.questionID,params.questionID,params.user,params.type], function(error, results){
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        let q = results[0][0];
                        q.tags = [];
                        results[1].forEach(function(tag){ q.tags.push(tag.tagName); });
                        callback(null, { question: q, answers: results[2] });
                    }
                    connection.release();         

                });
            }
        });
    }

    updateLikeDislikeAQuestion(params,callback){   
        this.pool.getConnection(function(error,connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            }else{
                let sql1 = "SELECT q.ID as qID, q.title, q.body, q.date, q.visits, q.nLikes, q.nDislikes, u.ID as qUserID, u.profileImg, u.username FROM questions q JOIN users u WHERE q.user=u.email AND q.ID=?;";
                let sql2 = "SELECT t.tagName FROM tags t WHERE t.question=?;";
                let sql3 = "SELECT u.username as aUser, a.body, a.nLikes, a.nDislikes, a.date, u.ID as userID, u.profileImg FROM answers a JOIN users u WHERE a.user=u.email AND a.question=?;";
                let sql4=  "UPDATE questions_score q SET question= ? , user = ? , type = ? WHERE q.question= ? ";
                let sql = sql1 + sql2 + sql3 + sql4;
                connection.query(sql,[params.questionID, params.questionID, params.questionID,params.questionID,params.user,params.type,params.questionID], function(error, results){
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        let q = results[0][0];
                        q.tags = [];
                        results[1].forEach(function(tag){ q.tags.push(tag.tagName); });
                        callback(null, { question: q, answers: results[2] });
                    }
                    connection.release();         

                });
            }
        });

    }

    checkQuestionStatus(params,callback){
        this.pool.getConnection(function(error,connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            }else{               
                connection.query("SELECT COUNT(*) as filas, q.type as tipo FROM questions_score q WHERE q.question = ? ",[params.questionID], function(error, results){
                    connection.release();  
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(null,results);
                        //callback(null,{number: results.filas, tipo:results.tipo});
                    }
                });
            }
        });

    }    

    checkUserVisits(params,callback){
        this.pool.getConnection(function(error,connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            }else{
                connection.query("SELECT COUNT(*) as filas FROM visits v WHERE v.question =? AND v.user =?",[params.questionID, params.user], function(error, results){
                    connection.release();  
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(null,results);
                    }
                });
            }
        });
    }


    updateVisits(params,callback){
        this.pool.getConnection(function(error,connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            }else{                
                connection.query("INSERT INTO visits(question,user) VALUES(?,?)",[params.questionID, params.user], function(error, results){
                    connection.release();  
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(null,results);
                    }
                });
            }
        });

    }
    
}

module.exports = DAOQuestions;