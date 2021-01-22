"use strict"
const mysql         = require("mysql");
const pool          = mysql.createPool(config.mysqlConfig);
const daoT = new DAOTasks(pool);


let valorTareastags ='';
let valorTarea='';

function annadirTag(){
    let valor = $("#add-tag-input").prop("value").trim();
    valorTareastags += "@"+valor;
    let elem = $(`<span id ="tagInfo">${valor}</span>`);
    if(valor !== ""){
        $("#task-description").append(elem);
    }
    
}


function annadirTareasCompletadas(){
    
    if(valorTarea !== ""){// si hay tarea lo metes a la bd
    let newTask = Utils.createTask(valorTareastags);
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
    }
}



$(function(){

    $("#add-task-input").change(function(){

        valorTarea = $(this).prop("value").trim();// coges el valor del input
        valorTareastags +=valorTarea;
        let elem = $(`<span id ="spanInfo">${valorTarea}</span>`);
        $("#task-description").append(elem);

    });

    $("#btn-AddtagButton").on("click",annadirTag);

    $("#btn-AddtaskButton").on("click",annadirTareasCompletadas);

});