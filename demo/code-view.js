(function( document, window )
{
    const cssText=`
    <style> 
        @import "../../codemirror/lib/codemirror.css";
        @import "../../codemirror/theme/abcdef.css";
        .CodeMirror{ height: auto; }
    </style>`;
    const arr = [   "../../codemirror/lib/codemirror.js"
                ,   "../../codemirror/addon/selection/selection-pointer.js"
                ,   "../../codemirror/mode/xml/xml.js"
                ,   "../../codemirror/mode/javascript/javascript.js"
                ,   "../../codemirror/mode/css/css.js"
                ,   "../../codemirror/mode/vbscript/vbscript.js"
                ,   "../../codemirror/mode/htmlmixed/htmlmixed.js"
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
