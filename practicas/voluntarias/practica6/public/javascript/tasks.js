"use strict"


let valorTareastags ='';



function annadirTag(){
    let valor = $("#add-tag-input").prop("value").trim();
    valorTareastags += "@"+valor;
    let elem = $(`<span id ="tagInfo">${valor}</span>`);
    if(valor !== ""){
        $("#task-description").append(elem);
    }
    
}


function annadirTareasCompletadas(){
    
    
}



$(function(){

    $("#add-task-input").change(function(){

        let valor = $(this).prop("value").trim();// coges el valor del input
        valorTareastags +=valor;
        let elem = $(`<span id ="spanInfo">${valor}</span>`);
        $("#task-description").append(elem);

    });

    $("#btn-AddtagButton").on("click",annadirTag);

    $("#btn-AddtaskButton").on("click",annadirTareasCompletadas);

});