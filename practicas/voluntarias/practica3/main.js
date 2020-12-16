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
// daoUser.isUserCorrect("usuario+1@ucm.es", "mipass+1", cb_isUserCorrect);

// daoUser.getUserImageName("usuario+1@ucm.es", function(error, result){
//     if(error){
//         console.log(error.message);
//     } else if (result){
//         console.log("Nombre de la imagen: ", result[0].imageName);
//     } else{
//         console.log("No existe el usuario");
//     }
// });

// function cb_isUserCorrect(err, result){
//     if (err){
//         console.log(err.message);
//     } else if (result){
//         console.log("Usuario y contraseña correctos");
//     } else{
//         console.log("Usuario y/o contraseña incorrectos");
//     }
// }


/* DAOTAREAS */
daoTask.getAlltasks("usuario@ucm.es", function(error, result){
    if (error){
        console.log(error.message);
    } else if(result){
        console.log(result);
    } else{
        console.log("El usuario no tiene tareas");
    }
});

// daoTask.insertTask("usuario+1111@ucm.es", { text:"Poner la mesa", done:false, tags:['Mesa','Comida'] }, function(error){
//     if(error){
//         console.log(error.message);
//     }else{
//         console.log(`Tarea insertada`);
//     }
// });

// daoTask.markTaskDone(9, function(error){
//     if(error){
//         console.log(error.message);
//     }
//         else{
//         console.log(`Tarea actualizada`);
//     }
// });

// daoTask.deleteCompleted("usuario+2@ucm.es", (error)=>{
//     if(error){
//         console.log(error.message);
//     }
//     else{
//         console.log(`Borradas las tareas del usuario`);
//     }

// });

    
// Tenemos puesto en nuestra base de datos un delete cascade en el id en la tabla task
// SELECT id FROM task WHERE user='usuario@ucm.es'
// Hacer tantos => DELETE FORM Tag WHERE taskId=id;  como tareas tenga el usuario
// Posteriormente hacer =>    DELETE FROM task WHERE user='usuario@ucm.es';