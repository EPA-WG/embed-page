if( !window.currentScriptCounter )
    window.currentScriptCounter = 0;
window.currentScriptCounter ++;
document.querySelector('input').value = window.currentScriptCounter;