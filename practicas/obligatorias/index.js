"use strict"

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
//const DaoQuestionAndAnswer = require('./public/js/DaoQuestionAndAnswer');
const ficherosEstaticos = path.join(__dirname, "public");
const usersRouter = require("./routes/usuarios.js");
const questionsRouter = require('./routes/preguntas.js');

const app = express();

// CONFIGURAR EJS COMO MOTOR DE PLANTILLAS Y DEFINIR EL DIRECTORIO DE LAS PLANTILLAS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));


// MIDDLEWARES
app.use(express.static(ficherosEstaticos));
app.use(morgan('dev'));
app.use('/usuarios', usersRouter);
app.use('/preguntas', questionsRouter);

// middleware para las cookies: ver si ha iniciado la sesion o no
// middleware para ver que hacer cuando no encuentra un fichero estatico

// app.use(middlewareNotFoundError);
// app.use(middlewareServerError);


// LOS OBJETOS DE LA BASE DE DATOS


// MANEJADORES DE RUTAS
app.get("/", (request, response) => {
    response.status(200);
    response.render("index");
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
    


