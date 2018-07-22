const    $ = css=>document.querySelector(css)
, setClick = (css,cb)=> $(css).addEventListener('click',cb);
window.addEventListener('load', renderAppsList );
setClick( '.app-list-refresh' , renderAppsList  );
setClick( '.app-list-close'   , x=> window.close() );
setClick( '.app-list-open'    , x=>
{   const name = $('.app-list-name').value
    ,      url = $('.app-list-url' ).value;
    window.open(`${url}?name=${name}`, name, {target:window.target});
    renderAppsList();
});

function renderAppsList()
{
    document.querySelector('h1').innerText = location.search || location.pathname;
    const el = document.createElement('div')
    , encode = t => (el.innerText=t) && el.innerHTML
    , format = ( w, name )=> // as TR
        `<tr>${ [ name, w.name, w.target, w.location.pathname + w.location.search ]//
            .map( t=>'<td>'+encode(t)+'</td>').join('') }</tr>`;
    let p = format( window.parent, 'parent');
    let fr = frames;
    for( let i = 0; i < fr.length; i++ )
        p += format( fr[i], `frames[${i}]` );
    fr = parent.frames;
    for( let i = 0; i < fr.length; i++ )
        p += format( fr[i], `parent.frames[${i}]` );
    document.querySelector('.apps-list').innerHTML =  p ;
}