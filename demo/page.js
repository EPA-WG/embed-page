document.getElementById("external").checked=true;
[...document.getElementsByTagName('button')].forEach( b => b.onclick = ()=>ToggleCb(b) );

function ToggleCb( b )
{   let a = document.getElementsByClassName( b.getAttribute('for') );
    for( let x of a )
        x.checked = !x.checked;
}
const   $ = css => document.querySelector(css)
,       winLocation = $('.win-location')
,       docLocation = $('.doc-location');


winLocation.value = window.location;
docLocation.value = document.location;
document.querySelector('.win-location~*[value=get]').onclick = x => winLocation.value = window.location;
document.querySelector('.doc-location~*[value=get]').onclick = x => docLocation.value = document.location;
document.querySelector('.win-location~*[value=set]').onclick = x => window.location   = winLocation.value ;
document.querySelector('.doc-location~*[value=set]').onclick = x => document.location = docLocation.value ;

