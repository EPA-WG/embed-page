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
    scr.parentElement.insertBefore( span, scr );

    new MutationObserver( mutations =>
    {
        mutations.forEach( mutation =>
        {
            if( mutation.type === "attributes" && mutation.attributeName === 'value' )
            {
                span.innerText = format( scr.getAttribute( 'value' ) )
            }
        });
    }).observe( scr, { subtree : false, attributes: true } );
}

function format( value )
{
    const locales = scr.getAttribute('data-locales')
    ,     options = eval( scr.getAttribute('data-options') || '' ) || {}
    ,      attr2f = {}
    ,      f2Type = {  localeMatcher:String
                    ,  style: String, currency: String, currencyDisplay:String
                    ,  useGrouping: Boolean
                    ,  minimumIntegerDigits: Number, minimumFractionDigits: Number, maximumFractionDigits: Number, minimumSignificantDigits: Number, maximumSignificantDigits: Number
                    };
    Object.keys(f2Type).map( k=> attr2f['data-'+k.toLowerCase()] = k );

    for( let attr of scr.attributes )
    {   let k = attr2f[ attr.name ];
        if( k )
            options[ k ] = f2Type[k]  === Boolean
                         ? attr.value === 'true'
                         : f2Type[k]  === Number ? attr.value*1 : attr.value;
    }
    return  (   locales
                ?  Intl.NumberFormat( locales, options )
                :  Intl.NumberFormat( options )
            ).format( value );
}

