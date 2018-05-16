document.getElementById("external").checked=true;
[...document.getElementsByTagName('button')].forEach( b => b.onclick = ()=>ToggleCb(b) );

function ToggleCb( b )
{   let a = document.getElementsByClassName( b.getAttribute('for') );
    for( let x of a )
        x.checked = !x.checked;
}
const   $          = css => document.querySelector(css)
,       getApiText = ()=> $('input[name=l]:checked').value
,       locationText = $('textarea');

$('*[value=get]').onclick = ()=> locationText.value = eval( getApiText() );
$('*[value=set]').onclick = ()=> eval( getApiText() + '=locationText.value' );

locationText.value = location;

document.querySelector('*[value="other properties"]').onclick = x => locationText.value = JSON.stringify(
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

$('*[value="assign()"]' ).onclick = x => window.location.assign ( locationText.value );
$('*[value="replace()"]').onclick = x => window.location.replace( locationText.value );
$('*[value="reload()"]' ).onclick = x => window.location.reload() ;
$('*[value=location-win-doc]').onclick = x=> locationText.value =
                   location === window.location && location === document.location ;
$('*[value="this===window"]' ).onclick = x=> locationText.value = window === this;
