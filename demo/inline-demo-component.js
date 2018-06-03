import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
// import '../embed-page.js';

class InlineDemoComponentHtml extends PolymerElement
{
    static get is() { return 'inline-demo-component'; }
    static get template()
    {
        return html`
        <paper-listbox attr-for-selected="page" selected="{{url}}" fallback-selection="page-violet.html"
                       style="display: inline-block; box-shadow: 1px 1px 0.5em 0.3em grey;"
            >
            <paper-item page="page-violet.html">violet</paper-item>
            <paper-item page="page-purple.html">purple</paper-item>
        </paper-listbox>
        selected:[[url]]
        
        <iron-ajax url="[[url]]"    handle-as="text" auto
                   last-response="{{htmlContent}}"
        ></iron-ajax>
        
        <!--<embed-page0><template>[[htmlContent]]</template></embed-page0>-->
        <embed-page html="[[htmlContent]]"></embed-page>
        
        `;
    }
}
customElements.define(InlineDemoComponentHtml.is, InlineDemoComponentHtml);
