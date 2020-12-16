const config        = require("./config");
const DAOTasks      = require("./DAOTasks");
const Utils         = require("./utils");
const path          = require("path");
const mysql         = require("mysql");
const express       = require("express");
const bodyParser    = require("body-parser");
const morgan        = require("morgan");
const staticFiles   = path.join(__dirname, "public");
const pool          = mysql.createPool(config.mysqlConfig);

// Crear un servidor Express.js
const app = express();

// MIDDLEWARES
app.use(express.static(staticFiles));
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(bodyParser.urlencoded({ extended: false }));

// Crear un pool de conexiones a la base de datos de MySQL


// Crear una instancia de DAOTasks
const daoT = new DAOTasks(pool);

app.get("/tasks", function(request, response){
    daoT.getAlltasks('usuario@ucm.es', function(error, taskList){
        if(error){
            console.log(error.message);
        } else{
            response.status(200);
            response.render("tasks", { taskList });
        }
    });
});

app.get("/finish/:id", function(request, response){
    daoT.markTaskDone(request.params.id, function(error){
        if(error){
            console.log(error.message);
        } else{
            response.redirect("/tasks");
        }
    });
});

app.post("/addTask", function(request, response){
    let newTask = Utils.createTask(request.body.task_name);
    let data    = {
        text    : newTask.text,
        tags    : newTask.tags,
        done    : false
    };

    daoT.insertTask('usuario@ucm.es', data, function(error){
        if(error){
            console.log(error.message);
        } else{
            response.redirect("/tasks");
        }
    });
});

app.post("/deleteCompleted", function(request, response){
    daoT.deleteCompleted('usuario@ucm.es', function(error){
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