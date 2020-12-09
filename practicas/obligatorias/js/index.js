"use strict"

const { text } = require('body-parser');
const { response } = require('express');
const express= require('express');
const mysql = require ('mysql');
const config = require('./config');
const path = require('path');
const DaoUsers = require('./DaoUsers');

//const router = require('router');

const app = express();
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "./views"));


const pool = mysql.createPool({
    host: config.host,
    user    : config.user,
    password: config.password,
    database: config.database
});


// objetos de la aplicacion
let daoUsers = new DaoUsers(pool); 
let daoQuestionAndAnswers = new DaoQuestionAndAnswer(pool);


app.get("/", (req,res)=>{
    response.type("text/plain ,charset=utf-8");
    response.end("Esta es la pagina raiz");
});


app.get("/users", (req,res)=>{
    // llamar a la funcion que te devuelve los usuarios de la base de datos
    //response.render("users"{users:daoUser.readAllUsers() });
});



