/*************************************/
/* Carlos Segundo y David Fernández  */
/*          PRACTICA 2               */
/*************************************/

let listaTareas = [
    { text: "Preparar práctica AW", tags: ["AW", "practica",] },
    { text: "Mirar fechas congreso", done: true, tags: [] },
    { text: "Ir al supermercado", tags: ["personal"] },
    { text: "Mudanza", done: false, tags: ["personal"] },
];

// EJERCICIO 1
function getToDoTasks(tasks){
    return tasks.filter(task => task.done === false || !task.done).map(sol => sol.text);
}
//console.log('FUNCION 1: ', getToDoTasks(listaTareas));


// EJERCICIO 2
function findByTag(tasks, tag){
    return tasks.filter(task => task.tags.includes(tag));
}
//console.log('FUNCION 2: ', findByTag(listaTareas, "personal"));


// EJERCICIO 3
function findByTags(tasks, tagsParam){
    return tasks.filter(task => task.tags);
}
//console.log('FUNCION 3: ', findByTags(listaTareas, ["personal", "practica"]));


// EJERCICIO 4
function countDone(tasks){
    return tasks.filter(task => task.done).length;
}
//console.log('FUNCION 4: ', countDone(listaTareas));


// EJERCICIO 5
function createTask(texto){
    let obj = {
        text: '',
        tags: []
    };
    // sacar todos los tags en una funcion y meterlos a un array , (es una linea en JS)
    // /(@[A-Za-z])\w+/
    

    return obj;
}
//console.log('FUNCION 5: ', createTask("Ir al médico @personal @salud"));
//console.log('FUNCION 5: ', createTask("@AW         @practica Preparar práctica AW"));