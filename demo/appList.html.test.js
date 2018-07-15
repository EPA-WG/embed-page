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

    test('2. epa.contentWindow & contentDocument proxying API to implementation', function()
    {
        // epa.contentWindow.location === src
    });

    test('3. epa.open ', function()
    {
        // about:blank as initial state
        // url as final
        // initial doc != final doc
    });

    test('4. epa.close', function()
    {

    });

    test('5. epa events to match epa.contentWindow events', function()
    {   // epa.onload & epa.contentWindow.onload
        // iframe.contentDocument.addEventListener('DOMContentLoaded'
        // contentWindow
    });

    test('5. window.frames', function()
    {
        // access index & by name
        // list only child or same @target
        // same as content of epa.contentWindow
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
