import EpaParser from '../EpaParser';
suite('embed-page postMessage test ', () =>
{

    setup( ()=>{} );

    // test('Blank scripts', function()
    // {
    //     const scriptData = EpaParser("" );
    //     assert.deepEqual( scriptData.imports, [] );
    // });
    // test('import url', function()
    // {
    //     const scriptData = EpaParser('import "abc.js";' );
    //     assert.deepEqual( scriptData.imports, ["abc.js"] );
    // });

    // test('import ABC from url', function()
    // {
    //     const scriptData = EpaParser('import ABC from "abc.js";' );
    //     assert.deepEqual( scriptData.imports, ["abc.js"] );
    // });

    [ [ "function f(){}"                   , ['f']     ]
    , [ "function f(){ function z(){} }"   , ['f']     ]
    ].forEach( T => test( T[0], function()
    {
        const scriptData = EpaParser( T[0] );
        assert.deepEqual( scriptData.funcs, T[1] );
    }));

    [ [ "var zz;"                   , ['zz']            ]
    , [ "var a,b=0,c"               , ['a','b','c']     ]
    , [ "var [a, b] = [1,2]"        , ['a','b']         ]
    , [ "var [x, y]=[1,2],z;"       , ['x','y','z']     ]
    , [ "var a,{b},[c]=[1];"        , ['a','b','c']     ]
    ].forEach( T => test( T[0], function()
    {
        const scriptData = EpaParser( T[0] );
        assert.deepEqual( scriptData.vars, T[1] );
    }));

    [ [ "let zz;"                   , ['zz']            ]
    , [ "let a,b=0,c"               , ['a','b','c']     ]
    , [ "let [a, b] = [1,2]"        , ['a','b']         ]
    , [ "let [x, y]=[1,2],z;"       , ['x','y','z']     ]
    , [ "let a,{b},[c]=[1];"        , ['a','b','c']     ]
    ].forEach( T => test( T[0], function()
    {
        const scriptData = EpaParser( T[0] );
        assert.deepEqual( scriptData.lets, T[1] );
    }));

    [ [ "const zz;"                   , ['zz']            ]
    , [ "const a,b=0,c"               , ['a','b','c']     ]
    , [ "const [a, b] = [1,2]"        , ['a','b']         ]
    , [ "const [x, y]=[1,2],z;"       , ['x','y','z']     ]
    , [ "const a,{b},[c]=[1];"        , ['a','b','c']     ]
    ].forEach( T => test( T[0], function()
    {
        const scriptData = EpaParser( T[0] );
        assert.deepEqual( scriptData.consts, T[1] );
    }));

    // import
    // dyn import
    // var
    // let/const
    // function
});
