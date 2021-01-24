"use strict"




let valorTag='',tags='';




$(function(){    
    

    $("#add-tag-input").change(function(event){
        valorTag = $(this).val().trim();// coges el valor del tag
        let elem = $(`<span class="spanInfo mt-5 mb-5">${valorTag}</span>`);
        $("#tags-div").append(elem);
        tags +=valorTag;
        event.preventDefault();
    });

    $("#addTagsButton").on("click",function(event){
        $("#labelsInfo").prop("value",tags);       
        
    });
    
})