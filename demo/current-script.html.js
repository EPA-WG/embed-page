var        f = document.querySelector('.document-selected')
, parentNode = f.parentNode
,         cs = document.currentScript;

if( cs )
{   parentNode = cs.parentNode;
    f = parentNode.querySelector('.current-script-related');
    f.value = f.value + cs.title;
    // console.log( 'executed',cs.outerHTML.substring(0,60) );
    appendTag1( 'div', 'called '+ cs.outerHTML.substring(0,47).replace( /</g , '&lt;') );
}else
{
    appendTag1( 'div', "currentScript undefined" );
    // console.log( 'executed ???' );
}

f = document.querySelector('.document-selected');
f.value = f.value + ( cs ? cs.title : '?' );

    function
appendTag1( tag, text )
{   let t = document.createElement(tag);
    t.innerHTML = text;
    parentNode.appendChild(t);
}
