const config        = require("./config");
const DAOTasks      = require("./DAOTasks");
const DAOUsers      = require("./DAOUsers");
const Utils         = require("./utils");
const path          = require("path");
const mysql         = require("mysql");
const express       = require("express");
const bodyParser    = require("body-parser");
const morgan        = require("morgan");
const staticFiles   = path.join(__dirname, "public");
const pool          = mysql.createPool(config.mysqlConfig);
const session       = require('express-session');
const mysqlSession  = require('express-mysql-session');
const MySQLStore    = mysqlSession(session);
const sessionStore  = new MySQLStore({
    host        : config.mysqlConfig.host,
    user        : config.mysqlConfig.user,
    password    : config.mysqlConfig.password,
    database    : config.mysqlConfig.database
});
const middlewareSession = session({
    saveUninitialized   : false,
    secret              : "DavidCarlos",
    resave              : false,
    store               : sessionStore
});

// Crear un servidor Express.js
const app = express();

// MIDDLEWARES
app.use(express.static(staticFiles));
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middlewareSession);

// Comprueba si el usuario está logueado o no
function checkSession(request, response, next){
    if (request.session.currentUser !== undefined) {
        response.locals.userEmail = request.session.currentUser; // SOLO para tener el email accesible es los EJS
        next();
    } else {
        response.redirect("/login");
    }
}

// Crear una instancia de los DAOs
const daoT = new DAOTasks(pool);
const daoU = new DAOUsers(pool);

app.get("/login", function(request, response){
    response.render("login", { errorMsg : null });
});

app.post("/login", function(request, response){
    daoU.isUserCorrect(request.body.email, request.body.password, function(error, exists){
        if(error){
            console.log("========================== ERROR ==========================", error.message);
        } else if(exists){
            request.session.currentUser = request.body.email;
            response.redirect("/tasks");
        } else{
            response.status(200);
            response.render("login", { errorMsg : "Direccion de correo y/o contraseña no válidos" });
            response.end();
        }
    });
});

app.get("/tasks", checkSession, function(request, response){
    daoT.getAlltasks(response.locals.userEmail, function(error, taskList){
        if(error){
            console.log(error.message);
        } else{
            response.status(200);
            response.render("tasks", { taskList });
            response.end();
        }
    });
});

app.get("/finish/:id", checkSession, function(request, response){
    daoT.markTaskDone(request.params.id, function(error){
        if(error){
            console.log(error.message);
        } else{
            response.redirect("/tasks");
        }
    });
});


app.get("/logout", function(request, response){
    request.session.destroy();
    response.redirect("/login");
});

app.get("/imagenUsuario", checkSession, function(request, response){
    daoU.getUserImageName(response.locals.userEmail, function(error, img){
        if(error){
            console.log("========================== ERROR ==========================", error.message);
        } else if(img){
            response.sendFile(path.join(__dirname, img));
        } else{
            response.sendFile(path.join(__dirname, "./public/img/NoPerfil.png"));
        }
    });
});

app.post("/addTask", checkSession, function(request, response){
    let newTask = Utils.createTask(request.body.task_name);
    let data    = {
        text    : newTask.text,
        tags    : newTask.tags,
        done    : false
    };

    daoT.insertTask(response.locals.userEmail, data, function(error){
        if(error){
            console.log(error.message);
        } else{
            response.redirect("/tasks");
        }
    });
});

app.post("/deleteCompleted", checkSession, function(request, response){
    daoT.deleteCompleted(response.locals.userEmail, function(error){
        if(error){
            console.log(error.message);
        } else{
            response.redirect("/tasks");
        }
    });
});

// Arrancar el servidor
app.listen(config.port, function (error) {
    if (error) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});

// Por si se hace peticion a / o 
app.get("*", function(request, response){
    response.status(200);
    response.type("text/plain; charset=utf-8");
    response.end("No existe la pagina solicitada");
});