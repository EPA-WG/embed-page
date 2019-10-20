// Binds one dom element text or attribute to another element text or attribute
//
// script parameters passed as attributes
//      data-src-select, data-dst-select - css selector for source and destination node
//      data-src-attribute - the attribute name from source to watch for populating into destination node.
//                          if omitted the innerText of source node is used.
//      data-dst-attribute - attribute name of destination node which will be set on change of source node.
//                          if omitted the innerText of destination node is used.

const scr = document.currentScript;

const bind = ( srcEl, srcAttr ) =>
{
    const config  = { attributes: !!srcAttr
                    ,  childList:  !srcAttr
                    ,    subtree:  !srcAttr
                    };

    const   update = txt =>
        {   [ ...document.querySelectorAll( scr.getAttribute('data-dst-select') ) ]
                .map( dst =>
                {   const attr = scr.getAttribute('data-dst-attribute');
                    attr ? dst.setAttribute( attr, txt )
                         : dst.innerText = txt;
                })
        }
    ,    callback = mutationsList =>
        {   for( let mutation of mutationsList )
                if( srcAttr )
                {   if( mutation.type === 'attributes' && mutation.attributeName === srcAttr )
                        update( el.getAttribute( srcAttr ) );
                }else
                    if( mutation.type === 'childList' )
                        update( el.innerText );
        };

    if( 'value' === srcAttr )
        srcEl.addEventListener( 'input', function(){ update( this.value )} );
    const observer = new MutationObserver( callback );
    observer.observe( srcEl, config );
    return observer; // Later, you can stop observing by calling observer.disconnect();
};

[ ...document.querySelectorAll( scr.getAttribute('data-src-select') ) ]
    .map( el => bind( el, scr.getAttribute('data-src-attribute') ) );

