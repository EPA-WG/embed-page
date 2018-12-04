if( !window.currentScriptCounter )
    window.currentScriptCounter = 0;
window.currentScriptCounter ++;
document.querySelector('input').value = window.currentScriptCounter;

let cs = document.currentScript;
appendText( 'div', cs ? `called script type=${cs.type} title=${cs.title}` : "currentScript undefined" );
appendText( 'u', `scripts count=${ document.getRootNode().querySelectorAll('script').length }` );

function appendText( tag, text )
{   var t = document.createElement(tag);
    t.innerHTML = text;
    document.body.appendChild(t);
}