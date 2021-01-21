"use strict"

module.exports = {
    getToDoTasks: function(tasks){
        return tasks.filter(task => task.done === false || !task.done).map(sol => sol.text);
    },

    findByTag: function(tasks, tag){
        return tasks.filter(task => task.tags.includes(tag));
    },

    findByTags: function(tasks, tagsParam){
        return tasks.filter(task => task.tags.length > 0 && task.tags.filter(tag => tagsParam.includes(tag)));
    },

    countDone: function(tasks){
        return tasks.filter(task => task.done).length;
    },

    createTask: function(texto){
        var fullTags    = texto.split(" ").filter(word => /@(.+)/.test(word)); // Para un texto completo: /@(.[^ \n\r]+)/
        var newTags     = fullTags.map(tag => tag.replace('@', ''));
        var taskName    = texto.split(" ").filter(word => word !== '' && fullTags.includes(word) === false).join(" ");
    
        return { text: taskName, tags: newTags };
    }
};