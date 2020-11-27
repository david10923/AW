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
daoTask.getAlltasks("usuario@ucm.es", function(error, result){
    if (error){
        console.log(err.message);
    } else if(result){
        console.log(result);
    } else{
        console.log("El usuario no tiene tareas");
    }
});
