suite('embed-page postMessage test ', () =>
{
    let e1, e2, e3, e4, e5, e6, e7, $e1, $e2, $e3, $e4, $e5, $e6, $e7 //, $$e0, $$e1
    ,    $p = css => document.querySelector(css)
    ,   $$p = css => document.querySelectorAll(css);
    let AllReady;

    setup( ()=> AllReady || (AllReady = wait4all().then( args =>
                {   [   e1,  e2,  e3,  e4,  e5,  e6,  e7 ] = args;
                    [  $e1, $e2, $e3, $e4, $e5, $e6, $e7 ] = args.map( epa => ( css => epa.shadowRoot.querySelector   (css) ) );
                    // [ $$e0, $$e1 ] = args.map( epa => ( css => epa.shadowRoot.querySelectorAll(css) ) );
                }))
    );

    test('Initial scripts set', function()
    {
        assert.equal( 14, $$p('script[title]').length );
        let titles = [...document.querySelectorAll('script[title]')].map( x=>x.title).sort().join('');
        assert.equal( titles, "ABCDFKLMNUWXYZ" );// scripts in page scope or withing embed-page scope="none"
    });
    test('0. Browser standard behavior. Running 4 scripts on page level.', function()
    {
        assert.equal( "WX", $p('.current-script-related').value );
        assert( $p('.document-selected').value.startsWith("WX?U") );
    });
    test('1. embed-page with inline scripts, 1st instance.', function()
    {
        assert.equal( "0123", $e1('.current-script-related').value );
        assert.equal( "0123", $e1('.document-selected'     ).value );
    });
    test('2. embed-page with inline scripts, 2nd instance', function()
    {
        assert.equal( "4567", $e2('.current-script-related').value );
        assert.equal( "4567", $e2('.document-selected'     ).value );
    });
    test('3. embed-page with scripts in current-script-microapp.html', function()
    {
        assert.equal( "ABCD", $e3('.current-script-related').value );
        assert.equal( "ABCD", $e3('.document-selected'     ).value );
    });
    test('4. unscoped embed-page with inline scripts', function()
    {
        assert.equal( "KLMN", $p('#e4 .current-script-related').value );
    });
    test('5. unscoped embed-page with scripts in current-script-microapp.html', function()
    {
        assert.equal( "ABCD", $p('#e5 .current-script-related').value );
        assert.equal(     "", $p('#e5 .document-selected'     ).value );
    });
    test('6. embed-page with inline script type=module', function()
    {
        assert.equal( "E", $e6('.current-script-related').value );
        assert.equal( "E", $e6('.document-selected'     ).value );
    });
    test('7. unscoped embed-page with inline script type=module', function()
    {
        assert.equal( "F", $p('#e7 .current-script-related').value );
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
        return Promise.all( ["e1","e2","e3","e4","e5","e6","e7"].map( wait4load ) );
    }
        function
    wait4load( id )
    {
        const E = document.getElementById( id );
        assert.notEqual( E, null );
        return E.promise;
    }
});
