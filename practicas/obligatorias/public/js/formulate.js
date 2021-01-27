$(function(){
    // Tags que va metiendo el usuario
    let tags        = [],
        tagsInput   = $('input[name=labels]');

    // Accion meter tag al input
    $('.system-tags .tag').click(function(){
        let tagName = $(this).html();

        if(!tags.includes(tagName)){
            tags.push(tagName);
            tagName = '@' + $(this).html();
            tagsInput.val(tagsInput.val() + tagName);
        }
    });

    // Detectar cambio del input labels por si borra algun tag
    $('input[name=labels]').change(function(event){
        event.preventDefault();
        let tagsStr = $(this).val();
        let _tags = [];

        _tags = tagsStr.split('@').filter(function(tag){
            var check = tag != '' && !_tags.includes(tag);
            _tags.push(tag);
            return check;
        });

        tags = _tags;
    });

});