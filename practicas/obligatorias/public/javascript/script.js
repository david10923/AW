"use strict"


$(function(){    
    

    $(".etiquetas").on("click",function(){
        let valorTag = $(this).html();
        let tags='';
        tags = $("#add-tag-input").prop("value");
        if(!tags.includes(valorTag)){
            tags += "@" +valorTag;
            $("#add-tag-input").prop("value",tags);
        }      
    });

    
    
})