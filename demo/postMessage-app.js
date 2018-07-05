var url = location.href.substring(location.href.lastIndexOf('/')+1);
window.addEventListener('message', ev=>
   document.querySelector('tbody').innerHTML += `
        <tr><td>${ev.data}</td><td>${ev.origin}</td></tr>` );
document.querySelector('button').addEventListener('click'
    , x=> (window.opener||window.parent).postMessage(url,'*'));