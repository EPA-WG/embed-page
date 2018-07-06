const  url = location.href.substring(location.href.lastIndexOf('/')+1)
,   dopost = x=>(window.parent ||window.opener).postMessage(url,'*');

window.addEventListener('message', ev=>
       document.querySelector('tbody').innerHTML += `
            <tr><td>${ev.data}</td><td>${ev.origin}</td></tr>` );

window.addEventListener("load", x=>
{
    document.querySelector('button').addEventListener('click', dopost );
    dopost();
});