"use strict"

const bodyParser = require('body-parser');
// const { response } = require('express');
const express = require('express');
const mysql = require ('mysql');
const config = require('./public/js/config'); // sacar de public ?
const path = require('path');
const morgan = require('morgan');
const DaoUsers = require('./public/js/DaoUsers.js');
const DaoQuestionAndAnswer = require('./public/js/DaoQuestionAndAnswer');

// FICHEROS ESTATICOS DE LA APLICACION
const ficherosEstaticos = path.join(__dirname, "public");

const pool = mysql.createPool({
    host    : config.host,
    user    : config.user,
    password: config.password,
    database: config.database
});

//const router = require('router');
const app = express();

// CONFIGURAR EJS COMO MOTOR DE PLANTILLAS Y DEFINIR EL DIRECTORIO DE LAS PLANTILLAS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));


// MIDDLEWARES
app.use(express.static(ficherosEstaticos));
app.use(morgan('dev'));
// middleware para las cookies: ver si ha iniciado la sesion o no
// middleware para ver que hacer cuando no encuentra un fichero estatico

// app.use(middlewareNotFoundError);
// app.use(middlewareServerError);


// LOS OBJETOS DE LA BASE DE DATOS
let daoUsers = new DaoUsers(pool); 
let daoQuestionAndAnswers = new DaoQuestionAndAnswer(pool);


// MANEJADORES DE RUTAS
app.get("/", (request, response) => {
    // no iria aqui el render del index ???
    response.type("text/plain; charset=utf-8");
    response.end("Esta es la pagina raiz");
});


app.get("/users", (request, response) => {
    daoUsers.readAllUsers(function(error, allUsers){
        if(error){
            response.status(400);
            response.type("text/plain; charset=utf-8");
            response.end("Error al get users");
        } else{
            response.status(200);
            response.render("users", { users: allUsers });
        }
    });
});

app.listen(3000, function(err) {
    if (err) {
    console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
    console.log("Servidor arrancado en el puerto 3000");
    }
});

app.get("*", (request, response) => {
    response.status(200);
    response.render("error");
});



//FUNCIONES QUE GESTIONAN LOS ERRORES 

// function middlewareNotFoundError(request, response){
//     response.render("error");
//     // envío de página 404
// }

// //llamar a este desde cualquier middleware cuando haya algun problema
// function middlewareServerError(error, request, response, next){
//     response.status(500);
//     // envío de página 500
// }
    


