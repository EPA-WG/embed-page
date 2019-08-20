(function( document, window )
{
    const cssText=`
    <style> 
        @import "../node_modules/codemirror/lib/codemirror.css";
        @import "../node_modules/codemirror/theme/abcdef.css";
        .CodeMirror{ height: auto; }
    </style>`;
    const arr = [   "../node_modules/codemirror/lib/codemirror.js"
                ,   "../node_modules/codemirror/addon/selection/selection-pointer.js"
                ,   "../node_modules/codemirror/mode/xml/xml.js"
                ,   "../node_modules/codemirror/mode/javascript/javascript.js"
                ,   "../node_modules/codemirror/mode/css/css.js"
                ,   "../node_modules/codemirror/mode/vbscript/vbscript.js"
                ,   "../node_modules/codemirror/mode/htmlmixed/htmlmixed.js"
                ];
    loadScript();

    function loadScript()
    {   var t = arr.shift();
        if( !t )
            return renderCode();

        var s = document.createElement( 'script' );
            s.src = t;
        s.onload = loadScript;
        document.head.appendChild( s );
    }

    function renderCode()
    {
        var s = document.createElement( 'div' );
        s.innerHTML = cssText;
        document.body.appendChild(s);
        [...document.getElementsByTagName('code') ].forEach( ta =>
        {   const src = ta.getAttribute('src');
            src && fetch(src)
                .then( r=>r.text() )
                .then( txt => CodeMirror( ta,   {   mode: src.includes('.js') ? "javascript" : "htmlmixed"
                                                ,   value:txt, theme:'abcdef'
                                                } ) );
        })
    }
})(document, window);
