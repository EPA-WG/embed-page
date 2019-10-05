suite('embed-page basics IFRAME test ', () =>
{
    let epa0,  $0, epa1,  $1;

    let AllReady;

    setup( ()=> AllReady || (AllReady = wait4all().then( args =>
                {   [ epa0, epa1 ] = args;
                    [ $0, $1 ] = args.map( epa => ( css => epa.shadowRoot.querySelector(css) ) );
                }))
    );

    test('1. initial set', function()
    {
        assert.equal( $0('input').value, '' );
    });
    test('2. <a onclick="gblFunc()" ', ()=>
    {
        SimClick( $0( '.green' ) );
        assert.equal( $0( 'input' ).value, 'green' );
        assert.equal( $1('input').value, '' );
        SimClick( $1( '.green' ) );
        assert.equal( $1( 'input' ).value, 'green' );
    });
    test('3. <a href="javascript:void(0)" onclick="gblFunc()" ', function()
    {
        SimClick( $0('.yellow') );
        assert.equal( $0('input').style.background, 'yellow' );
        assert.notEqual( $1('input').value, 'yellow' );
        SimClick( $1('.yellow') );
        assert.equal( $1('input').value, 'yellow' );
    });
    test('4. <a href="javascript:gblFunc()" ', function()
    {
        SimClick( $0('.blue') );
        assert.equal( $0('input').style.background, 'blue' );
    });

    test('5. global lastColor, <button onclick="document.querySelector(...)" > ', ()=>
    {
        SimClick( $0( 'button' ) );
        assert.equal( $0( 'input' ).value, 'blue' );
    });
    test('6. reload, final set ', function()
    {
        let ret = epa0.promiseNext;
        SimClick( $0('#reload') );
        return ret.then( x=>
        {
            assert.equal( $0('input').style.background, '' );
            assert.equal( $0('input').value, '' );
        });
    });

        function
    SimClick( el ){   el.dispatchEvent( new MouseEvent( "click" ));    }

        function
    wait4all()
    {
        return Promise.all([ wait4load( "epa-0" ), wait4load( "epa-1" ) ]);
    }
        function
    wait4load( id, url )
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
