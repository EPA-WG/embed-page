window.addEventListener('load', renderAppsList );
document.querySelector('.app-list-refresh').addEventListener('click', renderAppsList );

function renderAppsList()
{
    document.querySelector('h1').innerText = location.search || location.pathname;
    const format = ( w, name )=> // as TR
        `<tr>${ [ name, w.name, w.target, w.location.pathname+w.location.search ]//
            .map( t=>'<td>'+t+'</td>').join('') }</tr>`;
    let p = format( window.parent, 'parent');
    for( let i = 0; i < frames.length; i++ )
        p += format( frames[i], `frames[${i}]` );
    for( let i = 0; i < parent.frames.length; i++ )
        p += format( parent.frames[i], `parent.frames[${i}]` );
    document.querySelector('.apps-list').innerHTML =  p ;
}