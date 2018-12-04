if( !window.currentScriptCounter )
    window.currentScriptCounter = 0;
window.currentScriptCounter ++;
document.querySelector('input').value = window.currentScriptCounter;
var type = document.createElement('div')
,     cs = document.currentScript;
type.innerHTML= cs? `called script type=${cs.type} title=${cs.title}`: "currentScript undefined";
document.body.appendChild( type );