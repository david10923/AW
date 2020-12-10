"use strict"

const bodyParser = require('body-parser');
const { response } = require('express');
const express= require('express');
const mysql = require ('mysql');
const config = require('./public/js/config');
const path = require('path');
const morgan = require('morgan');
const DaoUsers = require('./public/js/DaoUsers.js');
const DaoQuestionAndAnswer= require('./public/js/DaoQuestionAndAnswer');
const ficherosEstaticos =path.join(__dirname,"public");

const pool = mysql.createPool({
    host: config.host,
    user    : config.user,
    password: config.password,
    database: config.database
});

//const router = require('router');
const app = express();

//PARA RENDERIZAR LA PAGINA CON EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));



//MIDDLEWARES

app.use(express.static(ficherosEstaticos));
app.use(morgan('dev'));

//HAY QUE VER DONDE PONER ESTOS MIDDLEWARES YA QUE SI LOS PONEMOS ANTES DE LOS MANEJADORES DE RUTAS NUNCA ENCONTRARÁ LA PÁGINA
// app.use(middlewareNotFoundError);
// app.use(middlewareServerError);




// LOS OBJETOS DE LA BASE DE DATOS
let daoUsers = new DaoUsers(pool); 
let daoQuestionAndAnswers = new DaoQuestionAndAnswer(pool);



//MANEJADORES DE RUTAS

app.get("/", (request,response)=>{
    response.type("text/plain ,charset=utf-8");
    response.end("Esta es la pagina raiz");
});


app.get("/users", (request, response) => {
    daoUsers.readAllUsers(function(error, allUsers){
        if(error){
            response.type("text/plain, charset=utf-8");
            response.end("Error al get users");
        } else{
            // llamar a la funcion que te devuelve los usuarios de la base de datos
            //response.sendFile("./public/css/utils.css");
            response.render("users", { users: allUsers });
        }
    });
});

// app.get("*", (request,response)=>{
//     response.type("text/plain ,charset=utf-8");
//     response.end("No hay nadaaaa");
// });


app.listen(3000, function(err) {
    if (err) {
    console.error("No se pudo inicializar el servidor: "
    + err.message);
    } else {
    console.log("Servidor arrancado en el puerto 3000");
    }
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
    


