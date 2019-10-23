* load optimisation: all vars marshalling is not needed, it is sufficient to marshall only vars from particular script
    * use currentScript.EPA_vars in sync code
* load optimisation: container window sanitizing is not needed if insulation done properly. Make it optional for hacky or suspicious code. Paranoid security mode.
* load optimisation: simultaneous injection of scripts delays whole page until all scripts are executed

# Release MVP
* release bundle build
* CDN deployment
* JSFiddle/Plunkr publishing, https://www.sitepoint.com/7-code-playgrounds 

* fix SCRIPT type!=module : keep original,do not create wrap, unit test
* unit test 4 failed to load JS(incorrect syntax & r/t exception)
* URL mapping and relative URLs resolving
    
* use    view-source: http schema ( instead of page execution) for fetching targetFrame  and onTargetLoad(), only in browsers which support view-source:(Chrome,FF, does not work in Edge)
* console methods test
* window.customElements API
* move demo to CDN, wc.org does not serve URL params
* document.head implementation (as script injection node in microapp)
* disable 'serviceWorker' in navigator until implemented
* 12 dwarfs demo  
* script nomodule support
* support integrity attribute
* target attribute in content ( A & FORM )
* epa.window.parent.location.href
* cookies, scope impl. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#A_complete_traps_list_example
* window.self
* navigator.serviceWorker.register
* insulation layers - define dynamic change logic and restrictions. 
* scope 
    * docs for insulation layers
    * window.* insulation
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

WishList
* browser-in-browser show case
* onerror event
* "noscript" attribute or scope value to serve content with JS completely disabled
* include embed-script-legacy.js in package as embed-page.js could be served only via type=module, still eill be handy 
    to serve via usual JS script tag.
* embed-page as es6 module ( now fails in strict mode due to 'with' operator )
    , use static import instead of dynamic 
* evaluate the use of DOMImplementation.createHTMLDocument|DOMImplementation.createDocument|new Document()   
* populate title attribute into document.head.title (via doc constructor param) & sync head.title to @title from 
    external doc.    
* embed-page.promise getter to avoid registering/release "load"/"error" event handlers.
    
## Test cases coverage
* error event
* cross-domain test: load, JS insulation, scope 
* epa.document.origin === window.top.document.origin

## APIs
* BroadcastChannel 
* documentElement, firstChild, firstElementChild, lastChild, lastElementChild
* forms, images, anchors, links, ...
* window.focus(), window.blur(), window.closed flag
* window.print()
* network control and management layer. Could be implemented by service workers or wrapping ajax APIs.
    