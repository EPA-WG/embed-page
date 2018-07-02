var url = location.href.substring(location.href.lastIndexOf('/')+1);
localStorage.setItem( 'a',"localStorage " + url);
window.localStorage.setItem( 'b',"window.localStorage " + url);
sessionStorage.setItem( 'a',"sessionStorage " + url);
window.sessionStorage.setItem( 'b',"window.sessionStorage " + url);