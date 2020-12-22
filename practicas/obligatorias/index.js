"use strict"

// GENERAL
const bodyParser        = require('body-parser');
const express           = require('express');
const path              = require('path');
const morgan            = require('morgan');
const staticFiles       = path.join(__dirname, "public");
const usersRouter       = require("./routers/routerUsuarios");
const questionsRouter   = require('./routers/routerPreguntas');
const loginoutRouter    = require('./routers/routerLogin.js');
const session = require('express-session');
const mysqlSession = require('express-mysql-session');
const config = require('./config');
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host:config.host,
    user:config.user,
    password:config.password,
    database:config.database
});
const middlewareSession = session({
    saveUninitialized: true,
    secret:"DavidCarlos",
    resave: false,
    store:sessionStore 
});


// SERVER
const app = express();


// CONFIGURAR EJS COMO MOTOR DE PLANTILLAS Y DEFINIR EL DIRECTORIO DE LAS PLANTILLAS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));


// MIDDLEWARES
app.use(express.static(staticFiles));
app.use(morgan('dev'));
app.use(middlewareSession); // middleware de session
// app.use(middlewareNotFoundError); // middleware ERROR 404
// app.use(middlewareServerError); // middleware ERROR 500


// ROUTERS
app.use('/usuarios', usersRouter);
app.use('/preguntas', questionsRouter);
app.use('/loginout', loginoutRouter);


// MANEJADORES DE RUTAS PRINCIPALES
app.get("/", (request, response) => {
    response.redirect("/index");
});

app.get("/index", (request, response) => {
    response.status(200);
    response.render("index");
    response.end();
});

app.listen(3000, function(error) {
    if (error) {
        console.error("No se pudo inicializar el servidor: " + error.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});

app.get("*", (request, response) => {
    response.status(200);
    response.render("error");
});


//FUNCIONES QUE GESTIONAN LOS ERRORES ==> mejor en otro fichero como databnse.js ????
// function middlewareNotFoundError(request, response){
//     response.render("error");
//     // envío de página 404
// }

// //llamar a este desde cualquier middleware cuando haya algun problema
// function middlewareServerError(error, request, response, next){
//     response.status(500);
//     // envío de página 500
// }