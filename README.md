# \<embed-page/\>
Web Component acting as responsive IFRAME, a proof of concept for 
[Embeddable Progressive Application](https://github.com/EPA-WG/EPA-concept).

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/EPA-WG/embed-page) [![Join the chat at https://gitter.im/embed-page/Lobby](https://badges.gitter.im/embed-page/Lobby.svg)](https://gitter.im/embed-page/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Security
* General browser and application [security improvements overview](security.md).
 
Briefly, increases security by jailing 3rd party content and JS, a secure alternative to directly including of 3rd party 
JS into page.
 
The scope insulation for DOM and CSS is done by WebComponet shadow dom, API for JS 
are insulated by closure for global objects with wrappers limiting the dom access root 
to component content. Similar approach is applied for url, storage, cookies, etc. 

## Use
1. Add to project via npm, bower, or simply placing `embed-page.js` into project tree
2. Import into page/module either by webcomponent `link rel="import"`, AMD require, ES6 import, or simple SCRIPT tag
3. Add some useful 3rd party [microapplication](https://github.com/EPA-WG/EPA-concept/blob/master/microapplication.md) into your page.

The content could be set either by **src** attribute or by Polymer {{data}} binding of content;
including the insulated content in TEMPLATE; or binding content via **html** attribute.
```html
    <embed-page src="abc.html" ></embed-page><!-- like seamless iframe -->
    
    <embed-page src="demo-menu.html" scope="none" ></embed-page><!-- like html import, no insulation -->
    

    <embed-page>    <!-- inline scope insulation -->
         <template>
             <style>h1{color:chocolate;}</style>
             <h1> In chocolate only itself, no fumes spread. </h1>
         <template>
    </embed-page>


    <!-- dynamic content binding -->
    <iron-ajax  last-response="{{htmlContent}}" url="abc.html" auto ></iron-ajax>
    <embed-page html="[[htmlContent]]"></embed-page>    
```

At the moment ``` <embed-page> ``` resides in Polymer echosystem, file the 
[change request](https://github.com/EPA-WG/embed-page/issues) if need other or no framework compatibility.

### Dependencies
There is no dependencies in run time. Polymer is used for demo and is not required to use \<embed-page/\>


## To see in action 
See the live basic [DEMO](https://raw-dot-custom-elements.appspot.com/EPA-WG/embed-page/v0.0.9/embed-page/demo/index.html)
, check the [demo page on webcomponents.org](https://www.webcomponents.org/element/EPA-WG/embed-page/demo/demo/index.html)
, or locally run
```bash
$ polymer serve --open
```
It will open the demo page in browser. 
In demo the external page is loaded into shadow dom and its embedded and referenced JS
will work with document via wrapper in same way as standalone page. 

The host page document is not available from embedded content, which is validated by using 
same DOM selectors as in host page as in instances of  ``` <embed-page> ```.


## Project
### Preparing
```bash
$ bower install
```
### Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. 
Then run `polymer serve --open` to serve your element locally.

### Running Tests

```bash
$ polymer test
```

Application is set up to be tested via 
[web-component-tester](https://github.com/Polymer/web-component-tester). 
Run `polymer test` to run your application's test suite locally.
