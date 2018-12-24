// Binds one dom element or attribute to
//      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
// script parameters passed as attributes
//      data-locales, data-options matches locales and options parameter
//      other data-XXX attribute matches parameter options.XXX
//      value attribute as a source
// by default injects SPAN with formatted text before SCRIPT element unless data-no-inject attribute defined

const scr = document.currentScript;
src.format = format;

const span = document.createElement('span');
span.innerText = format( src.getAttribute('value') );
if( !src.hasAttribute('data-no-inject') )
    scr.parentElement.insertBefore( src, span );


const bind = ( update, el, attrName ) =>
{
    const config  = { attributes: !!attrName
                    ,  childList:  !attrName
                    ,    subtree:  !attrName
                    };

    const callback = ( mutationsList, observer ) =>
    {
        for( let mutation of mutationsList )
            if( attrName )
            {   if( mutation.type == 'attributes' && mutation.attributeName === attrName )
                    update( el.getAttribute( attrName ) );
            }else
                if( mutation.type == 'childList' )
                    update( el.innerText );
    };

    const observer = new MutationObserver( callback );
    observer.observe( el, config );
    return observer; // Later, you can stop observing by calling observer.disconnect();
};

export const ChangeBind = bind;
