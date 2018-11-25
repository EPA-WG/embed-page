if( !window.currentScriptCounter )
    window.currentScriptCounter = 0;
window.currentScriptCounter ++;
document.querySelector('input').value = window.currentScriptCounter;
let type = document.createElement('div')
,     cs = document.currentScript;
type.innerHTML= `called script type=${cs.type} title=${cs.title}`;
document.body.appendChild( type );