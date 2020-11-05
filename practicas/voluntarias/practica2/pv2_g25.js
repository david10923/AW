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
    return tasks.filter(task => task.tags.length > 0 && task.tags.filter(tag => tagsParam.includes(tag)));
}
//console.log('FUNCION 3: ', findByTags(listaTareas, ["personal", "practica", "look"]));


// EJERCICIO 4
function countDone(tasks){
    return tasks.filter(task => task.done).length;
}
//console.log('FUNCION 4: ', countDone(listaTareas));


// EJERCICIO 5
function createTask(texto){
    let obj = {
        text: '',
        done: false,
        tags: []
    };

    var fullTags    = texto.split(" ").filter(word => /@(.+)/.test(word)); // Para un texto completo: /@(.[^ \n\r]+)/
    var newTags     = fullTags.map(tag => tag.replace('@', ''));
    var taskName    = texto.split(" ").filter(word => word !== '' && fullTags.includes(word) === false).join(" ");

    return { text: taskName, tags: newTags };
}
// console.log('FUNCION 5: ', createTask("Ir al médico @personal @salud"));
// console.log('FUNCION 5: ', createTask("@AW         @practica Preparar práctica AW"));
// console.log('FUNCION 5: ', createTask("Ir a @deporte entrenar"));
// console.log('FUNCION 5: ', createTask("@label Ir @another a @deporte entrenar"));