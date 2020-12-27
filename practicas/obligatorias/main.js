"use strict" // FICHERO UNICAMENTE PARA PRUEBAS CON LOS DAOS
const mysql = require ('mysql');
const config = require('./config');
const DAOUsers = require('./models/modelUsuarios');
const DAOQuestions= require('./models/modelPreguntas');


const pool = mysql.createPool({
    host: config.host,
    user    : config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
});


// objetos de la aplicacion
let daoUsers = new DAOUsers(pool); 
let daoQuestionAndAnswers = new DAOQuestions(pool);


// daoUsers.createUser({ email:"info@ucm.es", password:123, username:"Info Estudiantes", profileImg:"./public/resources/images/default.png" }, function(error, result){
//     if(error){
//         console.log('ERROR', error.message);
//     } else{
//         console.log("Creado con exito", result);
//     }
// });

// daoUsers.readAllUsers(function(error, result){
//     if(error){
//         console.log('ERROR', error.message);
//     } else{
//         console.log("Lectura", result);
//     }
// });

// daoUsers.readUser('info@ucm.es', function(error, result){
//     if(error){
//         console.log('ERROR', error.message);
//     } else{
//         console.log("Lectura", result);
//     }
// });

// daoQuestionAndAnswers.createQuestion({ email:"info@ucm.es", tittle:"¿para que sirve el padding?", body:"No se para que sirve el padddinq ya que me confundo con el margin"},function(error,result){
//     if(error){
//         console.log('ERROR', error.message);
//     }else{
//         console.log("Creada con exito", result);
//     }
    
// });

// daoQuestionAndAnswers.createAnswer({email:"info@ucm.es",id:2}, function(error,result){
//     if (error){
//         console.log('ERROR', error.message);
//     }
//     else{
//         console.log("Creada con exito", result);

//     }
// });

// daoQuestionAndAnswers.filterQuestionByTag('AW', function(error, result){
//     if(error){
//         console.log('ERROR', error.message);
//     }
//     else{
//         console.log("Devuelta con exito", result);
//     }
// });

// daoQuestionAndAnswers.readAllQuestion(function(error, res){
//     if(error){
//         console.log(error.message);
//     } else{
//         console.log(res);
//     }
// });

// daoQuestionAndAnswers.findByFilter('%title%', function(error, res){
//     if(error){
//         console.log(error.message);
//     } else{
//         console.log(res);
//     }
// });
// daoQuestionAndAnswers.filterQuestionByTag('AW', function(error, res){
//     if(error){
//         console.log(error.message);
//     } else{
//         // console.log(res);
//         res.questions.forEach(aux => {
//             console.log('tags de la pregunta ', aux.ID, ': ', aux.tags);
//         });
//     }
// });
daoQuestionAndAnswers.filterQuestionByID(2, function(error, res){
    if(error){
        console.log("==================", error.message);
    } else{
        console.log(res);
    }
});