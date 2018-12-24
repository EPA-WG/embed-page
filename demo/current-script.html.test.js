suite('embed-page postMessage test ', () =>
{
    let e0, e1, $e0, $e1, $$e0, $$e1
    ,    $p = css => document.querySelector(css)
    ,   $$p = css => document.querySelectorAll(css);
    let AllReady;

    setup( ()=> AllReady || (AllReady = wait4all().then( args =>
                {   [   e0,   e1 ] = args;
                    [  $e0,  $e1 ] = args.map( epa => ( css => epa.shadowRoot.querySelector   (css) ) );
                    [ $$e0, $$e1 ] = args.map( epa => ( css => epa.shadowRoot.querySelectorAll(css) ) );
                }))
    );

    test('1. initial scripts set', function()
    {
        // assert.equal( 4, $$p('script[title]').length );
        hasScript( $p, "non-module0"   );
        hasScript( $p, "non-module1"   );
        hasScript( $p, "module0"       );
        hasScript( $p, "module1"       );

        assert.equal( 4, $$e0('script[title]').length );
        hasScript( $e0, "non-module0"   );
        hasScript( $e0, "non-module1"   );
        hasScript( $e0, "module0"       );
        hasScript( $e0, "module1"       );

        assert.equal( 4, $$e1('script[title]').length );
        hasScript( $e1, "non-module0"   );
        hasScript( $e1, "non-module1"   );
        hasScript( $e1, "module0"       );
        hasScript( $e1, "module1"       );

        function hasScript( $, title ){ assert( $( `script[title=${title}]`) ) }
    });
    test('2. document.currentScript.getRootNode()', ()=>
    {
        assert.equal( 4, $$e0('script').length );
        assert.equal( 4, $$e1('script').length );
        assert.equal( 'scripts count=4', $e0('u').innerText );
        assert.equal( 'scripts count=4', $e1('u').innerText );
    });

    test('3. currentScript.getRootNode ',()=>
    {
       // TBD
    });

    test('4. script type=module with import ',()=>
    {
       // TBD
    });


        function
    SimClick( el ){   el.dispatchEvent( new MouseEvent( "click" )); }

        function
    absUrl( rel )
    {   const A = document.createElement('a');
        A.setAttribute( 'href', rel );
        return A.href;
    }
        function
    wait4all()
    {
        return Promise.all( ["e0","e1"].map( wait4load ) );
    }
        function
    wait4load( id )
    {
        const E = document.getElementById( id );
        assert.notEqual( E, null );
        return E.promiseNext;
    }
});
