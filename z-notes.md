# temp notes on dev process
Have a sense along with commits. Content would be cleared on commit following 
the annotated here commit. 

# embed-page.js run scripts flow
_loadHtml > runScriptsRaw > runScriptAs
_loadHtml > EPA_runScript > 

    _loadHtml( html )
        if( !this.isScoped() )
            el.innerHTML = html
            return this.runScriptsRaw( [ ... $( scripts, el ) ] )
        return EPA_runScript( [...$s], this.context, this.redirects );

    runScriptsRaw( arr )
            const currentScript = arr.shift();
            const s = currentScript;

            if( !s.src )
            {
                runScriptAs( s, s.textContent, this  ).then( x=>this.runScriptsRaw( arr ) );
            }else
                ajax( urlRedirectMap( currentScript.src, this.redirects ) )
                .then( txt => runScriptAs( s, txt, this ),   err => {debugger;}  )
                .then( x=>this.runScriptsRaw( arr ) );

    runScriptAs( s, txt, epc )
        c0.textContent = `const {   document,   location ,   localStorage,   sessionStorage } = epa_${epc.uid};
            const window = new Proxy( epa_${epc.uid}.window,...)
            var { varList } = { ...window };
            Object.defineProperty( document, 'currentScript',{ get: ()=>epa_currentScript, enumerable: false, configurable:true} );
            epa_${epc.uid}.trackExecution();
            '.replace("varList", Object.keys( c.window ) )
                            + txt +
            ` ; epa_${epc.uid}.onScriptExecuted();
            //# sourceURL=` + s.src ;


    function EPA_runScript( arr, env, redirects )
    {
        const s = ( ""+EPA_runScriptProto ).replace("varList", Object.keys( env.window ) );
        return eval( `(${s})` )( arr, env, redirects );
    }
    
    function EPA_runScriptProto( arr, env, redirects )
    {   const { document, location,localStorage, sessionStorage, parent, frames } = env;
        const window = new Proxy( env.window,
            {
                set: ( target, property, value, receiver ) =>
                    ( target[property]  =  eval(`typeof ${property}`) === undefined
                            ? value
                            : eval(`${property}=value`)
                    )
            });
        var { varList } = { ...window };
        const currentScript = arr.shift();
        ...
        (   currentScript.src
            ?   (   ajax( urlRedirectMap( currentScript.src, redirects ) )
                    .then( txt => runScriptAs( currentScript, txt, env.epc ) )
                )
            :   runScriptAs( currentScript, currentScript.text, env.epc  ) // todo src map
        ).finally( x => EPA_runScript( arr, env, redirects ) );
    }
    
    