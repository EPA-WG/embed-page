var  cs = document.currentScript;

if( cs )
{   scriptTitle2Input('.current-script-related', cs.parentNode );
    // console.log( 'executed',cs );
    appendText( 'called ' + cs.outerHTML.substring(0,47).replace( /</g , '&lt;') );
}else
{   appendText(  "currentScript undefined" );
    // console.log( 'executed ???' );
}
scriptTitle2Input('.document-selected', document);

    function
scriptTitle2Input( css, root )
{
    f = root.querySelector(css );
    f.value = f.value + ( cs ? cs.title : '?' );
}
    function
appendText( text )
{   let t = document.createElement('div');
    t.innerHTML = text;
    document.querySelector('.document-selected').parentNode.appendChild(t);
}
