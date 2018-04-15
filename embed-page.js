( function( win, doc )
{
    customElements.define('embed-page0', class extends HTMLElement
    {
        constructor()
        {
            super();
            const shadowRoot     = this._shadowRoot = this.attachShadow( { mode: 'open' } );
            shadowRoot.innerHTML = `<div id="framed" >
                                        <div id="content"></div>
                                        <div name="slotted" id="slotted">
                                            ~<slot>...</slot>~
                                        </div>
                                    </div>`;
            addObservers( this, "this");
        }
        connectedCallback()
        {   //super.connectedCallback();
            console.log( "connectedCallback" );
            const shadowRoot = this._shadowRoot
            ,           slot = shadowRoot.querySelector('#slotted slot');

            addObservers( slot, "slot");
            slot.addEventListener('slotchange', e =>
            {
                console.log( 'slotchange', slot );
                let newContent = slot.assignedNodes()[0];
                addObservers( newContent, "slot.assignedNodes");
            });
            //const t = this.firstElementChild && "TEMPLATE" === this.firstElementChild.nodeName && this.firstElementChild.innerHTML;
            //t && setContent( t );
        }
    });
    function addObservers( node, caseName )
    {
        "DOMSubtreeModified DOMCharacterDataModified DOMNodeInsertedIntoDocument DOMNodeRemovedFromDocument DOMNodeInserted DOMNodeRemoved"
            .split(' ').map( evName => node.addEventListener( evName   , e =>  console.log(evName,e) ) );

        Polymer.dom(node).observeNodes( info =>
                                     {   console.log (caseName+' Added nodes: '  , info.addedNodes);
                                         console.log (caseName+' Removed nodes: ', info.removedNodes);
                                     });
        new MutationObserver( x => console.log( caseName+' MutationObserver', node.textContent ) ).observe( node, { attributes: false, childList: true } );
    }
})( window, document );
