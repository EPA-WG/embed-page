// todo UMD
(function()
{
    class EmbedPage extends HTMLDivElement
    {
        constructor() { super(); }

        createdCallback()
        {
            // This element uses Shadow DOM.
            this.createShadowRoot().innerHTML = `
      <style>
        :host {
          display: block;
        }
      </style>
      <div id="quotes"><div>
    `;

            // Update the ticker prices.
            this.updateQuotes(); // We'll define this later.
        }

        connectedCallback()
        {
            let div = document.createElement( 'div' );
            Render( div );
            this.appendChild( div );
        }
    }

    window.customElements.define( 'embed-page', EmbedPage );
})();
