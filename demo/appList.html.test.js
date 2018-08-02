suite('embed-page window frames APIs ', () =>
{
    let E0,  XA,  XB, YA,  YB,  FA, FB
    ,  $E0, $XA, $XB,$YA, $YB, $FA, $FB
    ,   $$ = css => document.querySelector(css);

    const FA_URL = "appsList-microapp.html?src=iframeA"
    ,     FB_URL = "appsList-microapp.html?src=iframeB"
    ,     E0_URL = "appsList-microapp.html?from=epa0"
    ,     XA_URL = "appsList-microapp.html?name=A&target=X"
    ,     XB_URL = "appsList-microapp.html?name=B&target=X"
    ,     YA_URL = "appsList-microapp.html?name=A&target=Y"
    ,     YB_URL = "appsList-microapp.html?name=B&target=Y"
    ,   DEMO_URL = absUrl('../demo/');

    let AllReady, id_A, id_B, epaA, epaB, urlA, urlB;

    setup( ()=> AllReady || (AllReady = wait4all().then( args =>
                {   [  E0,  XA,  XB, YA,  YB,  FA,  FB ] = args;
                    [ $E0, $XA, $XB,$YA, $YB, $FA, $FB ] = args.map( epa => ( css => epa.shadowRoot.querySelector(css) ) );
                }))
    );

    test('Initial src set', function()
    {
        assert.include( E0.src, E0_URL ); assert.equal( E0.getAttribute('src'), E0_URL );
        assert.include( XA.src, XA_URL ); assert.equal( XA.getAttribute('src'), XA_URL );
        assert.include( XB.src, XB_URL ); assert.equal( XB.getAttribute('src'), XB_URL );
        assert.include( YA.src, YA_URL ); assert.equal( YA.getAttribute('src'), YA_URL );
        assert.include( YB.src, YB_URL ); assert.equal( YB.getAttribute('src'), YB_URL );
        assert.include( FA.src, FA_URL ); assert.equal( FA.getAttribute('src'), FA_URL );
        assert.include( FB.src, FB_URL ); assert.equal( FB.getAttribute('src'), FB_URL );
    });

    testPair( "FA,FB" ); // reference check on IFRAME, of course it should pass. If not the test is written wrong.
    testPair( "XA,XB" ); // same test cases on embed-page pair
    testPair( "YA,YB" ); // second pair assures there is no window name collision in window.frames

        function
    testPair( pair  )
    {

        suite( pair, ()=>
        {
            suiteSetup( ()=>
            {   [ id_A, id_B ] = pair.split(',');
                [ epaA, epaB ] = eval(`[${pair}]`);
                [ urlA, urlB ] = pair.split(',').map( id=>eval(`${id}_URL`) );
            });
            test(`1. epa.contentWindow.location matches SRC attribute`, function()
            {
                // epa.contentWindow.location === src
                epaA.window && assert.include( epaA.window.location       .href, urlA );
                               assert.include( epaA.contentWindow.location.href, urlA );
                epaB.window && assert.include( epaB.window.location       .href, urlB );
                               assert.include( epaB.contentWindow.location.href, urlB );
            });

            test(`2. parent.frames[A|B] matches URL`, function()
            {   // for X and Y targeted pairs it ensures insulation of parent.frames
                assert.include( epaA.contentWindow.parent.frames["A"].location.href, urlA );
                assert.include( epaA.contentWindow.parent.frames["B"].location.href, urlB );
            });

            test('3. epa.open() into C, close() ', function()
            {
                const parentFramesCount0 = epaA.contentWindow.parent.frames.length;
                const url = `appsList-microapp.html?pair=${pair}&case=3`
                ,       w = epaA.contentWindow.open( url,"C" );
                if( "IFRAME" === epaA.tagName )
                {   // standard window behavior just for reference and epa test clarity
                    assert( !w.closed );
                    const initialUrl = w.location.href;
                    if( initialUrl !== "about:blank" )
                        assert.include( initialUrl, url );
                    w.close();
                    const isClosed = w.closed;
                    assert( isClosed );
                }else
                {   assert.equal( 2, parentFramesCount0 );
                    assert.equal( 3, w.parent.frames.length );
                    assert( !w.closed );
                    assert( w.parent.frames["C"] );
                    assert.include( w.parent.frames["C"].location.href, url  );
                    assert.equal( 3, w.parent.frames.length );
                    w.close();
                    assert( w.closed );
                    assert( !w.parent.frames["C"] );
                    assert.equal( 2, w.parent.frames.length );
                }

                // about:blank as initial state
                // url as final
                // initial doc != final doc
            });

            test('4. epa.open replaces existing B window ', function()
            {
                assert( epaA.contentWindow.parent.frames["B"] );

                const parentFramesCount0 = epaA.contentWindow.parent.frames.length;
                const   url = `appsList-microapp.html?pair=${pair}&case=4`
                ,         w = epaA.contentWindow.open( url,"B" )
                ,initialUrl = w.location.href;

                assert.equal( parentFramesCount0, w.parent.frames.length ); // window B is reused
                assert( !w.closed );
                assert( w.parent.frames["B"] );

                return loadPromise(epaB).then( finalUrl =>
                {
                    assert.include( w.location.href, url );
                    assert.include( w.parent.frames["B"].location.href, url  );

                    if( "IFRAME" === epaA.tagName )
                    {   // standard window behavior just for reference and epa test clarity
                    }else
                    {
                        assert.equal( 2, w.parent.frames.length );
                    }
                    return true;
                });
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

        });
    }


        function
    loadPromise( el )
    {
        return new Promise( ( resolve, reject ) =>
        {
            const loadCb = x=>{ release(); resolve( el.contentWindow.location.href ) }
            ,    errorCb = x=>{ release(); reject ( el.contentWindow.location.href ) };

            el.addEventListener( 'load', loadCb  );
            el.addEventListener( 'error', errorCb );

                function
            release()
            {
                el.removeEventListener('load' , loadCb  );
                el.removeEventListener('error', errorCb );
            }
        });
    }
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
        return Promise.all( ["e0","xa","xb","ya","yb","fa","fb"].map( wait4load ) );
    }
        function
    wait4load( id )
    {
        if( id.startsWith('f') )
            return Promise.resolve( $$( '#'+id ) );
        const E = document.getElementById( id );
        assert.notEqual( E, null );
        return E.promiseNext;
    }
});
