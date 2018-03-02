# EPA browser and application security improvement overview

Current standards stack provides a little for 3rd party UI integration into web page. 
In order to allocate some space in page for 3rd party app content host page either 
* should suffer from IFRAME limitations or
* compromise own security by injecting 3rd party JS into page.

\<embed-page\> has given a flexibility of embedded DOM and IFRAME kind of browsing 
context insulation.

Unlike direct injection of 3rd party script EPA executes JS in host page with 
insulation layer preventing access to document, window and major APIs. 

\<embed-page\> at this stage yet a proof of concept for 
[Embeddable Progressive Application](https://github.com/EPA-WG/EPA-concept) and potentially 
the polyfill for standard-to-be implemented natively by browser with all security concerns addressed.


  