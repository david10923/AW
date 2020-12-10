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

//const router = require('router');

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));



//MIDDLEWARES

app.use(express.static(ficherosEstaticos));
app.use(morgan('dev'));



const pool = mysql.createPool({
    host: config.host,
    user    : config.user,
    password: config.password,
    database: config.database
});


// objetos de la aplicacion
let daoUsers = new DaoUsers(pool); 
let daoQuestionAndAnswers = new DaoQuestionAndAnswer(pool);


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


