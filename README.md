# \<embed-page\>
Proof of concept for 
[Embeddable Progressive Application](https://github.com/EPA-WG/EPA-concept)
 - a microapplication container, a WebComponent acting as seamless IFRAME and html include

[![git](https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/mark-github.svg) GitHub](https://github.com/EPA-WG/embed-page) 
| [demo](https://cdn.xml4jquery.com/ajax/libs/embed-page/0.0.20/build/esm-unbundled/demo/index.html)
[![NPM version][npm-image]][npm-url]
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/embed-page) 

## Where to use?
<code>&lt;embed-page/&gt;</code>  covers 2 extreme cases.

1.    Super-<b>simple</b> development with library of pre-made microapplications and plain html codebase.
            It assumes no web component knowledge and development.
2.    Super-<b>complex</b> apps where on same page need to mix UX made with different frameworks and their incompatible otherwise revisions.<br/>
            The JS Context insulation of embed-page provides "evolutionary architecture" support to web page.
    
## Security
* General browser and application [security improvements overview](security.md).
 
Briefly, increases security by jailing 3rd party content and JS, a secure alternative to directly including of 3rd party 
JS into page.
 
The scope insulation for DOM and CSS is done by WebComponet shadow dom, API for JS 
are insulated by closure for global objects with wrappers limiting the dom access root 
to component content. Similar approach is applied for url, storage, cookies, etc. 

## Use
1. Add to project via npm, bower, or simply placing `embed-page.js` into project tree
2. Import into page/module either by ES6 import, simple SCRIPT tag, webcomponent `link rel="import"`, or AMD require 
3. Develop your reusable widgets as insulated HTML and include into page by ```<embed-page>``` or
 
Add some useful 3rd party [microapplication](https://github.com/EPA-WG/EPA-concept/blob/master/microapplication.md) 
into your page same way.

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
Polymer 3 Element is a base for embed-page. No other dependencies in run time planned before first release 
( currently project is in pre-release alpha stage). Polymer Paper Elements and Vaadin are used for demo and 
are not required to use \<embed-page/\>

## To see in action 
See the live basic [DEMO on CDN](https://cdn.xml4jquery.com/ajax/libs/embed-page/0.0.20/build/esm-unbundled/demo/index.html)
, [JSFiddle](https://jsfiddle.net/suns2015/k2sdfrt1/)
, or locally run
```bash
$ polymer serve --open
```
It will open the demo page in browser. 
In demo the external page is loaded into shadow dom and its embedded and referenced JS
will work with document via wrapper in same way as standalone page. 

The host page document is not available from embedded content, which is validated by using 
same DOM selectors as in host page as in instances of  ``` <embed-page> ```.

# Project
## Install the Polymer-CLI

First, make sure you have npm (packaged with [Node.js](https://nodejs.org)) installed. 
Run `npm install` to install your element's dependencies, then run `polymer serve` 
to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Demo pages are set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

[npm-image]:      https://img.shields.io/npm/v/embed-page.svg
[npm-url]:        https://npmjs.org/package/embed-page
