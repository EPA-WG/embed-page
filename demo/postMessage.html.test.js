suite('embed-page postMessage test ', () =>
{
    let e0, e1, $e0, $e1, $$ = css => document.querySelector(css);

    const fr = document.querySelector('iframe')
    , FR_URL = "postMessage-app.html?from=iframe"
    , E0_URL = "postMessage-app.html?from=epa0"
    , E1_URL = "postMessage-app.html?from=epa1" ;

    let AllReady;

    setup( ()=> AllReady || (AllReady = wait4all().then( args =>
                {   [  e0,  e1 ] = args;
                    [ $e0, $e1 ] = args.map( epa => ( css => epa.shadowRoot.querySelector(css) ) );
                }))
    );

    test('1. initial src set', function()
    {
                                        assert.equal( fr.getAttribute('src'), FR_URL );
        assert.equal( e0.src, E0_URL ); assert.equal( e0.getAttribute('src'), E0_URL );
        assert.equal( e1.src, E1_URL ); assert.equal( e1.getAttribute('src'), E1_URL );
    });

    test('2. from IFRAME', function()
    {
        assert.equal( 1, $$('table').innerText.match( /from=iframe/g ).length );
    });
    test('3. from epa0 & epa1', function()
    {
        assert.equal( 2, $$('table').innerText.match( /from=epa0/g ).length );// both(data & origin) include URL
        assert.equal( 2, $$('table').innerText.match( /from=epa1/g ).length );

        SimClick( $e0('button') );
        assert.equal( 4, $$('table').innerText.match( /from=epa0/g ).length );
        assert.equal( 2, $$('table').innerText.match( /from=epa1/g ).length );

        SimClick( $e1('button') );
        assert.equal( 4, $$('table').innerText.match( /from=epa0/g ).length );
        assert.equal( 4, $$('table').innerText.match( /from=epa1/g ).length );
    });
    test('4. to epa0 & epa1', function()
    {
        assert.isNull( $e0('table').innerText.match( /from=demo/g ) );
        assert.isNull( $e1('table').innerText.match( /from=demo/g ) );

        SimClick( $$('.to-epa0') );
        assert.equal( 1, $e0('table').innerText.match( /from=demo/g ).length );
        assert.equal( 1, $e0('table').innerText.match( /from=demo/g ).length );
        assert.isNull(   $e1('table').innerText.match( /from=demo/g ) );

        SimClick( $$('.to-epa1') );
        assert.equal( 1, $e0('table').innerText.match( /from=demo/g ).length );
        assert.equal( 1, $e1('table').innerText.match( /from=demo/g ).length );
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
