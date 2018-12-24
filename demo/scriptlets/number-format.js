// exposes Intl.NumberFormat API
//      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
// script parameters passed as attributes
//      data-locales, data-options matches locales and options parameter
//      other data-XXX attribute matches parameter `options.XXX`
//      value attribute as a source
// script injects SPAN with formatted text before SCRIPT element unless data-no-inject attribute defined

const scr = document.currentScript;
scr.format = format;

if( !scr.hasAttribute('data-no-inject') )
{   const span = document.createElement('span');
    span.innerText = format( scr.getAttribute('value') );
    scr.parentElement.insertBefore( span, scr);
}

function format( value )
{
    const locales = scr.getAttribute('data-locales')
    ,     options = eval( scr.getAttribute('data-options') || '' ) || {};
    for( let attr of scr.attributes )
        if( !'locales,options'.includes( attr.name.replace('data-','') ) )
            options[attr.name] = attr.value;

    return  (   locales
                ?  Intl.NumberFormat( locales, options )
                :  Intl.NumberFormat( options )
            ).format( value );
}

export const NumberFormat = format;
