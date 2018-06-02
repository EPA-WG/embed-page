* test suite, test automation for all features
* postMessage, scope impl.
* cookies, scope impl.
* insulation layers - define dynamic change logic and restrictions. 
* scope - docs for insulation layers
* history
* Web Components
    * wrap window.customElements to use CustomElementRegistry for Web Components scope insulation
    * sample with same component tag but different implementation
    * CustomElementRegistry use for loading WC via **link rel="import"** 
* separate sample on each aspect
* clipboard protection & insulation
* microapplications
    * intro page, menu & view-source samples, reference to registry
    * view-source app pages: view & form ( source url, theme )
* [Extend HTMLElement](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) instead of Polymer.Element
    * use embed-page.js as entry point  
* bower & npm publish
* instructions to use
* form post
* event handlers re-evaluation for embedded content
 
* compatibility with Polymer, Ionic, Stencil, React, Angular,?...
* series of examples in [Plunker](http://plnkr.co/), add examples into ApiFusion, 
    back links from Plunker to AF as "other examples" link. 
    
Release 1

* remove Polymer dependencies
* remove the use of cancelled XHRs.     
* **iframe.contentWindow** protection to 

WishList
* "storage" event propagation for apps in same scope 
* "noscript" attribute or scope value to serve content with JS completely disabled
* embed-page as es6 module ( now fails in strict mode due to 'with' operator )
    , use static import instead of dynamic 