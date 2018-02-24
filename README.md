# \<embed-page/\>
Proof of concept for 
[Embeddable Progressive Application](https://github.com/EPA-WG/EPA-concept) - 
WebComponent acting as IFRAME.

The scope insulation for DOM and CSS is done by WebComponet shadow dom, API for JS 
are insulated by closure for global objects with wrappers limiting the dom access root 
to component content. Similar approach will be applied for url, storage, cookies, etc. 

The content could be set either by **src** attribute or by Polymer {{data}} binding of content.
```html
    <embed-page src="abc.html" />
    
    <iron-ajax  last-response="{{htmlContent}}" url="abc.html" auto ></iron-ajax>
    <embed-page>[[htmlContent]]</embed-page>
```

## To see in action 
Check the [demo page on webcomponents.org](https://www.webcomponents.org/element/EPA-WG/embed-page/demo/demo/index.html)
 or locally run
```bash
$ polymer serve --open
```
It will open the demo page in browser. 
In demo the external page is loaded into shadow dom and its embedded and referenced JS
will work with document via wrapper in same way as standalone page. 

The host page document is not available from embedded content, which is validated by using 
same DOM selectors as in host page as in instances of  ``` <embed-page> ```.


## Preparing project
```bash
$ bower install
```
## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. 
Then run `polymer serve --open` to serve your element locally.

## Running Tests

```bash
$ polymer test
```

Application is set up to be tested via 
[web-component-tester](https://github.com/Polymer/web-component-tester). 
Run `polymer test` to run your application's test suite locally.
