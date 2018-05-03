import { PolymerElement } from '@polymer/polymer/polymer-element.js';
export default (function( doc,win )
{
    class StorageView extends Polymer.Element
    {
        static get template()
        {
            return Polymer.html`
                   <style>:host { color: blue; }</style>
                   <h2>String template</h2>
                   <div>I've got a string template!</div>`;
        }
    }
    customElements.define('storage-view', StorageView);
    return StorageView;
})( document,window );