var url = location.href.substring(location.href.lastIndexOf('/')+1);
localStorage.setItem( 'a',"localStorage " + url);
sessionStorage.setItem( 'a',"sessionStorage " + url);