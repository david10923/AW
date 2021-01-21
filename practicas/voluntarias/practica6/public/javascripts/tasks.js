$(function(){
    let wrapper         = $('.wrapper'),
        task_name       = wrapper.find('.task .name-task'),
        labelsWrapper   = wrapper.find('.task .labels');
    
    // Ver si se puede hacer de otra manera
    let task = '', tags = [];

    function insertTag(tagName, wp){
        if(tagName){
            tags.push(tagName);
            wp.append(`<span class="label">${tagName}</span>`);
        }
    }

    // Accion de añadir tag
    $('button.add-tag').click(function(event){
        event.preventDefault();
        let tagName = wrapper.find('input[name=tag_name]').val();
        insertTag(tagName, labelsWrapper);
    });

    // Accion de añadir nombre de la tarea
    $('input[name=task_name]').change(function(event){
        event.preventDefault();
        task_name.html($(this).val());
        task = $(this).val();
    });

    // Accion boton sumbit de enviar tarea
    $('.AddtaskButton button[type=submit]').click(function(event){
        if(!task){
            event.preventDefault();
        }else{
            $('input[name=task_name]').text('HPAA');
        }
    });
});