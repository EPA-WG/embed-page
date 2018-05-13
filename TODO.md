* bug: window.location does not match SRC, instead uses host page url.
* localStorage, sessionStorage
* scope insulation layers (domain,host,page,**instance**,named,none) - param & storage
* insulation layers - dynamic change? 
* cookies, insulation
* layers - docs
* history
* Web Components
    * wrap window.customElements to use CustomElementRegistry for Web Components scope insulation
    * sample with same component tag but different implementation
    * CustomElementRegistry use for loading WC via **link rel="import"** 
* separate sample on each aspect
* [Extend HTMLElement](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) instead of Polymer.Element
    * use embed-page.js as entry point  
* bower & npm publish
* instructions to use
* form post
* event handlers re-evaluation for embedded content
* test suite

 
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