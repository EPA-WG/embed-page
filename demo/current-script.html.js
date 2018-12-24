var        f = document.querySelector('.document-selected')
, parentNode = f.parentNode
,         cs = document.currentScript;

if( cs )
{   parentNode = cs.parentNode;
    f = parentNode.querySelector('.current-script-related');
    f.value = f.value + cs.title;
    console.log( 'executed',cs.outerHTML.substring(0,60) );
    appendText( 'div', 'called '+ cs.outerHTML.substring(0,50).replace( /</g , '&lt;') );
}else
{
    appendText( 'div', "currentScript undefined" );
    console.log( 'executed ???' );
}
// debugger;
f = document.querySelector('.document-selected');
f.value = f.value + ( cs ? cs.title : '?' );

    function
appendText( tag, text )
{   let t = document.createElement(tag);
    t.innerHTML = text;
    parentNode.appendChild(t);
}