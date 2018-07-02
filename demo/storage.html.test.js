suite('embed-page basics IFRAME test ', () =>
{
    let e0, a0, a1, b0, b1, $e0, $a0, $a1,$b0, $b1, $$ = css => document.querySelector(css);

    const FR_URL = "page-storage.html?src=iframe"
    ,     E0_URL = "page-storage.html?name=sample"
    ,     A0_URL = "page-storage.html?name=a&instance=0"
    ,     A1_URL = "page-storage.html?name=a&instance=1"
    ,     B0_URL = "page-storage.html?name=b&instance=0"
    ,     B1_URL = "page-storage.html?name=b&instance=1"
    ,     DEMO_URL = absUrl('../demo/');

    let AllReady;

    setup( ()=> AllReady || (AllReady = wait4all().then( args =>
                {   [  e0,  a0,  a1,  b0,  b1 ] = args;
                    [ $e0, $a0, $a1, $b0, $b1 ] = args.map( epa => ( css => epa.shadowRoot.querySelector(css) ) );
                }))
    );

    test('1. initial src set', function()
    {
        assert.equal( e0.src, E0_URL ); assert.equal( e0.getAttribute('src'), E0_URL );
        assert.equal( a0.src, A0_URL ); assert.equal( a0.getAttribute('src'), A0_URL );
        assert.equal( a1.src, A1_URL ); assert.equal( a1.getAttribute('src'), A1_URL );
        assert.equal( b0.src, B0_URL ); assert.equal( b0.getAttribute('src'), B0_URL );
        assert.equal( b1.src, B1_URL ); assert.equal( b1.getAttribute('src'), B1_URL );
    });

    test('2. localStorage set&get insulated', function()
    {
        SimClick( $e0('.onGetLocal'  ) ); assert.equal( $e0('.value').value, "localStorage "   + E0_URL);
        SimClick( $e0('.onGetSession') ); assert.equal( $e0('.value').value, "sessionStorage " + E0_URL);
        assert.notEqual( localStorage.getItem('a'), "localStorage "   + E0_URL ); // not changed in container window
    });

    test('3. localStorage set&get&event in named scope', function()
    {   const V = "localStorage from "   + A0_URL;

        assert.notInclude( $a0('table').innerText, V );
        assert.notInclude( $a1('table').innerText, V );
        $a0('.value').value = V; SimClick( $a0('.onSetLocal'  ) );
        assert.notInclude( $a0('table').innerText, V ); // does not fire event on itself
        assert.   include( $a1('table').innerText, V ); // but fires in own named scope
        assert.notInclude( $e0('table').innerText, V ); // not fires in other scopes

        SimClick( $a0('.onGetLocal'  ) ); assert.equal( $a0('.value').value, V ); // preserved in a0
        SimClick( $a1('.onGetLocal'  ) ); assert.equal( $a1('.value').value, V ); // and also populated in a1
        assert.notEqual( $e0('.value').value, V );                                // not changed in e0
        assert.notEqual( localStorage.getItem('a'), V );                          // not changed in container window
    });

    test('4. sessionStorage set&get&event in named scope', function()
    {   const V = "sessionStorage from "   + A0_URL;

        assert.notInclude( $a0('table').innerText, V );
        assert.notInclude( $a1('table').innerText, V );
        $a0('.value').value = V; SimClick( $a0('.onSetSession'  ) );
        assert.notInclude( $a0('table').innerText, V ); // does not fire event on itself
        assert.   include( $a1('table').innerText, V ); // but fires in own named scope
        assert.notInclude( $e0('table').innerText, V ); // not fires in other scopes

        SimClick( $a0('.onGetSession'  ) ); assert.equal( $a0('.value').value, V ); // preserved in a0
        SimClick( $a1('.onGetSession'  ) ); assert.equal( $a1('.value').value, V ); // and also populated in a1
        assert.notEqual( $e0('.value').value, V );                                 // not changed in e0
        assert.notEqual( sessionStorage.getItem('a'), V );                          // not changed in container window
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
        return Promise.all( ["e0","a0","a1","b0","b1"].map( wait4load ) );
    }
        function
    wait4load( id )
    {
        const E = document.getElementById( id );
        assert.notEqual( E, null );
        return E.promiseNext;
    }
});
