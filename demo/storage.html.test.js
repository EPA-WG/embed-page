suite('embed-page basics IFRAME test ', () =>
{
    let a0, a1, b0, b1, $a0, $a1,$b0, $b1, $$ = css => document.querySelector(css);

    const A0_URL = "page-storage.html?name=a&instance=0"
    ,     A1_URL = "page-storage.html?name=a&instance=1"
    ,     B0_URL = "page-storage.html?name=b&instance=0"
    ,     B1_URL = "page-storage.html?name=b&instance=1";
    let AllReady;

    setup( ()=> AllReady || (AllReady = wait4all().then( args =>
                {   [  a0,  a1,  b0,  b1 ] = args;
                    [ $a0, $a1, $b0, $b1 ] = args.map( epa => ( css => epa.shadowRoot.querySelector(css) ) );
                }))
    );

    test('1. initial src set', function()
    {
        assert.equal( a0.src, A0_URL ); assert.equal( a0.getAttribute('src'), A0_URL );
        assert.equal( a1.src, A1_URL ); assert.equal( a1.getAttribute('src'), A1_URL );
        assert.equal( b0.src, B0_URL ); assert.equal( b0.getAttribute('src'), B0_URL );
        assert.equal( b1.src, B1_URL ); assert.equal( b1.getAttribute('src'), B1_URL );
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
        return Promise.all( ["a0","a1","b0","b1"].map( wait4load ) );
    }
        function
    wait4load( id )
    {
        const E = document.getElementById( id );
        assert.notEqual( E, null );
        return E.promiseNext;
    }
});
