suite('embed-page basics IFRAME test ', () =>
{
    let epa0, epa1, $0, $1, $$ = css => document.querySelector(css);


    let AllReady;

    setup( ()=> AllReady || (AllReady = wait4all().then( args =>
                {   [ epa0, epa1 ] = args;
                    [ $0, $1 ] = args.map( epa => ( css => epa.shadowRoot.querySelector(css) ) );
                }))
    );

    test('1. color is undefined', function()
    {
        SimClick( $0('button') );
        assert.equal( $0('input').value, "undefined" );
        SimClick( $1('button') );
        assert.equal( $1('input').value, "undefined" );
    });
    test('4. external page.js executed', function()
    {
        assert.equal( $$('#external').checked, true );
        assert.equal( $0('#external').checked, true );
        assert.equal( $V('#external').checked, true );
        assert.equal( $P('#external').checked, true );
    });
    test('5. internal css executed', function()
    {
        assert.notEqual( $$('h1'), VIOLET_COLOR );
        assert.notEqual( $$('h1'), PURPLE_COLOR );

        assert.equal( getColor( $0('h1') ), VIOLET_COLOR );
        assert.equal( getColor( $V('h1') ), VIOLET_COLOR );
        assert.equal( getColor( $P('h1') ), PURPLE_COLOR );
    });
    test('6. external page.css executed', function()
    {
        assert.notEqual( $$('a'), VIOLET_COLOR );
        assert.notEqual( $$('a'), PURPLE_COLOR );

        assert.equal( getColor( $0('a') ), VIOLET_COLOR );
        assert.equal( getColor( $V('a') ), VIOLET_COLOR );
        assert.equal( getColor( $P('a') ), PURPLE_COLOR );
    });

    // if( window.parent.location.href.includes('demo/') ) // skip if from within demo/ where clicks are manual
    //     return;

    test('7. location API, read', function()
    {
        testVar( $V, 'location'             , EPA_V_URL );
        testVar( $V, 'location.href'        , EPA_V_URL );
        testVar( $V, 'window.location'      , EPA_V_URL );
        testVar( $V, 'document.location'    , EPA_V_URL );
        testVar( $V, 'document.URL'         , EPA_V_URL );
        testVar( $V, 'document.documentURI' , EPA_V_URL );

        testVar( $P, 'location'             , EPA_P_URL );
        testVar( $P, 'location.href'        , EPA_P_URL );
        testVar( $P, 'window.location'      , EPA_P_URL );
        testVar( $P, 'document.location'    , EPA_P_URL );
        testVar( $P, 'document.URL'         , EPA_P_URL );
        testVar( $P, 'document.documentURI' , EPA_P_URL );

        function testVar( $sel, varSrt, expectedVal )
        {
            $sel('input[value="'+varSrt+'"]').checked =true;
            $sel('textarea').value = "";
            SimClick( $sel('input[value="get"]') );
            assert.equal( $sel('textarea').value, DEMO_URL+expectedVal );
        }
    });

    test('8. change src attribute', function( )
    {
        const TEST_URL = 'page-purple.html?from=test8';
        epa0.setAttribute('src','page-purple.html?from=test8');
        return epa0.promise.then( x=>
        {   assert.equal( $0('h1').innerText, "Purple header" );
            assert.equal( $0('textarea').value, DEMO_URL+TEST_URL );
        });
    });

    test('9. form GET via form.submit', function()
    {
        assert.equal( $0('h1').innerText, "Purple header" );
        $0( 'form[action="page-violet.html"]' ).submit();
        return epa0.promise.then( E=>
        {   assert.equal( $0('h1').innerText, "Violet header" );
            assert.equal( $0('textarea').value, DEMO_URL+"page-violet.html?from=purple" );
        })
    });

    test('10. form GET via click', function()
    {
        assert.equal( $0('h1').innerText, "Violet header" );
        let ret = epa0.promiseNext.then( E=>
        {
            assert.equal( $0('h1').innerText, "Purple header" );
            assert.equal( $0('textarea').value, DEMO_URL+"page-purple.html?from=violet" );
        });
        SimClick( $0('input[value="GET"]') );
        return ret;
    });

    test('11. link click', function()
    {
        assert.equal( $0('h1').innerText, "Purple header" );
        let ret = epa0.promiseNext.then( E=>
        {
            assert.equal( $0('h1').innerText, "Violet header" );
            assert.equal( $0('textarea').value, DEMO_URL+"page-violet.html" );
        });
        SimClick( $0('a[href="page-violet.html"]') );
        return ret;
    });

    test('12. location API, set', function()
    {
        assert.equal( $0('h1').innerText, "Violet header" );
        let ret = epa0.promiseNext.then( E=>
        {
            assert.equal( $0('h1').innerText, "Purple header" );
            assert.equal( $0('textarea').value, DEMO_URL+"page-purple.html?api=location" );
        });
        $0('textarea').value = DEMO_URL+"page-purple.html?api=location";
        $0('input[value="location"]').checked = true;
        SimClick( $0('input[value="set"]') );
        return ret;
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
    getColor( el )
    {
        return window.getComputedStyle( el, null ).getPropertyValue('color')
    }
        function
    wait4all()
    {
        return Promise.all([ wait4load( "epa-0" ),  wait4load( "epa-1" ) ]);
    }
        function
    wait4load( id )
    {
        const E = document.getElementById( id );
        assert.notEqual( E, null );
        if( "complete" === E.readyState )
            return Promise.resolve(E);
        return new Promise( function( resolve, reject )
        {
            E.addEventListener( 'load' , x=> resolve(E) );
            E.addEventListener( 'error', x=> reject (E) );
        } );
    }
});
