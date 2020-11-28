"use strict";

const mysql     = require("mysql");
const config    = require("./config");
const DAOUsers  = require("./DAOUsers");
const DAOTasks  = require("./DAOTasks");

// Crear el pool de conexiones
const pool = mysql.createPool({
    host    : config.host,
    user    : config.user,
    password: config.password,
    database: config.database
});

let daoUser = new DAOUsers(pool);
let daoTask = new DAOTasks(pool);

/* DAOUSUARIOS */
/*daoUser.isUserCorrect("usuario@ucm.es", "mipass", cb_isUserCorrect);
daoUser.getUserImageName("usuario@ucm.es", function(error, result){
    if(error){
        console.log("No existe el usuario");
    } else if (result){
        console.log("Nombre de la imagen: ", result[0].imageName);
    } else{
        console.log("No existe el usuario");
    }
});
function cb_isUserCorrect(err, result){
    if (err){
        console.log(err.message);
    } else if (result){
        console.log(result);
    } else{
        console.log("Usuario y/o contraseña incorrectos");
    }
}*/


/* DAOTAREAS */
// daoTask.getAlltasks("usuario+1@ucm.es", function(error, result){
//     if (error){
//         console.log(error.message);
//     } else if(result){
//         console.log(result);
//     } else{
//         console.log("El usuario no tiene tareas");
//     }
// });


// daoTask.markTaskDone(7, function(error){
//     if(!error){
//         console.log(`Tarea actualizada`);
//     }
// });

daoTask.insertTask("usuario+2@ucm.es", { text:"Nueva tarea XD", done:false, tags:['XD','MS'] }, function(error){
    if(!error){
        console.log(`Tarea insertada`);
    }
});

// daoTask.deleteCompleted("usuario+10@ucm.es", (error)=>{
//     if(!error){
//         console.log(`Borradas las tareas del usuario`);
//     }

// });
    