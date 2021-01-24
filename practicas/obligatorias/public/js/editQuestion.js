$(function(){
    let tags = [];

    // Si la pregunta ya tiene tags los actualizamos
    $.each($('.main-question div.tags .tag'), function(i, tag){
        tags.push($(tag).html());
    });

    function showError(message){
        $('.main-question .error').html(message);
    }

    // Add tag action
    $('input.add-tag-action').change(function(event){
        event.preventDefault();

        let tagName = $(this).val();
        if(tagName && tags.length < 5){
            tags.push(tagName);
            $('.main-question div.tags').append(`<span class="tag">${tagName}</span>`);
        } else{
            showError('Asegurate que solo has introducido 5 etiquetas y ninguna está vacía');
        }
        $(this).val('')
    });

    // Remove tag action
    $('.main-question div.tags .tag').click(function(){
        $(this).remove();
    });

    // Set tags before send form
    $('.main-question form button[type=submit]').click(function(event){
        if($('input[name=title]').val() && $('input[name=body]').val()){
            let tagsStr = '';
            $.each(tags, function(i, tag){
                tagsStr += `@${tag}`;
            });
            $('input[name=labels]').prop('value', tagsStr);
        } else{
            event.preventDefault(); // no mandar peticion
            showError('Rellena todos los campos obligatorios marcados con *');
        }
    });

});