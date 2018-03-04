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
document.querySelector('*[value=href-get]').onclick = x => winLocation.value    = window.location.href ;
document.querySelector('*[value=href-set]').onclick = x => window.location.href = winLocation.value ;
document.querySelector('*[value="other properties"]').onclick = x => winLocation.value = JSON.stringify(
    {   protocol    : window.location.protocol
    ,   host        : window.location.host
    ,   hostname    : window.location.hostname
    ,   port        : window.location.port
    ,   pathname    : window.location.pathname
    ,   search      : window.location.search
    ,   hash        : window.location.hash
    ,   username    : window.location.username
    ,   password    : window.location.password
    ,   origin      : window.location.origin
    });

document.querySelector('*[value="assign()"]' ).onclick = x => window.location.assign ( winLocation.value );
document.querySelector('*[value="replace()"]').onclick = x => window.location.replace( winLocation.value );
document.querySelector('*[value="reload()"]' ).onclick = x => window.location.reload() ;
