
        suite('embed-page HTML include', () =>
        {
            test('initial src set, loaded event fired & content ready', function(done)
            {
                const E = document.querySelector('#html-include-test');
                assert.equal(E.src, "demo-menu.html?inline");
                assert.equal( E.getAttribute('src'), "demo-menu.html?inline" );
                if( E.readyState === "complete")
                {
                    const m = document.querySelector('nav');
                    assert.equal(m.id, 'menu');
                    done()
                }
                else E.addEventListener('load', x=>
                {
                    const m = document.querySelector('nav');
                    assert.equal(m.id, 'menu');
                    done()
                });
            });
        });