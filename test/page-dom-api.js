let cb = document.getElementById("external");
cb.checked=true;
[...document.getElementsByTagName('button')].forEach( b => b.onclick = ()=>ToggleCb(b) );

function ToggleCb( b )
{   let a = document.getElementsByClassName( b.getAttribute('for') );
    for( let x of a )
        x.checked = !x.checked;
}