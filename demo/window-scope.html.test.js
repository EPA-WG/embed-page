suite('embed-page inline content', () =>
{
    let e0, e1, $e0, $e1, $$ = css => document.querySelector(css);

    let AllReady;

    setup( ()=> AllReady || (AllReady = wait4all().then( args =>
        {   [  e0,  e1 ] = args;
            [ $e0, $e1 ] = args.map( epa => ( css => epa.shadowRoot.querySelector(css) ) );
        }))
    );
    const getEpaInputValue = ( epaId, cl ) => document.getElementById(epaId).shadowRoot.querySelector( 'input.' + cl ).value;

    test('1. epa0 window.abc=ABC', function()
    {
        const v = getEpaInputValue( "e0", "w");
        assert.equal( v, "ABC" );
    });
    test('2. epa0 abc==ABC', function()
    {
        const v = getEpaInputValue( "e0", "g");
        assert.equal( v, "ABC" );
    });
    test('3. epa1 window.abc=XYZ', function()
    {
        const v = getEpaInputValue( "e1", "w");
        assert.equal( v, "XYZ" );
    });
    test('4. epa1 abc==XYZ', function()
    {
        const v = getEpaInputValue( "e1", "g");
        assert.equal( v, "XYZ" );
    });

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
