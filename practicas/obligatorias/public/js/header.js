var header = document.getElementById('header');
if(header){
    console.log('entro');
    header.getElementsByClassName('logo').onclick = function(){
        console.log('pa casa');
    };
}

function f(){
    console.log('pa casa');
}