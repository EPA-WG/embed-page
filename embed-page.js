import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
// import('../@polymer/polymer/polymer-element.js').then( ({html, PolymerElement}) =>{

( function( win, doc )
{
    const   FRAME_HASH_PREFIX   = '#embed-page='
    ,       FRAME_BLANK         = "about:blank"
    ,       ABS_URL = /(^\/)|(^#)|(^[\w-\d]*:)/;
    let     GBL_InstancesCount  = 0
    ,       GBL_ScriptsCount    = 0;

    class EpaHrefLocationHolder
    {
        constructor( app, a )
        {
            this.getHref    = x=> a.href;
            this.setHref    = v=> app.src = v;
            this.toString   = x=>a.href;
            this.getProp    = p=>a[p];
            this.reload     = x=> app.fetch();
        }
        get href( ){ return this.getHref( ) }
        set href(v){ return this.setHref(v) }
        get protocol(){ return this.getProp('protocol'  )}
        get host    (){ return this.getProp('host'      )}
        get hostname(){ return this.getProp('hostname'  )}
        get port    (){ return this.getProp('port'      )}
        get pathname(){ return this.getProp('pathname'  )}
        get search  (){ return this.getProp('search'    )}
        get hash    (){ return this.getProp('hash'      )}
        get username(){ return this.getProp('username'  )}
        get password(){ return this.getProp('password'  )}
        get origin  (){ return this.getProp('origin'    )}
        assign      (v){ return this.setHref( v ) }
        replace     (v){ return this.setHref( v ) }// todo skip in window history
    }
    class EpaStorageWrapper
    {
        // todo Window.onstorage event handler that fires when a storage area changes
        constructor( /** Storage */ storage, /** EpaWindow */ epaWin, /** EmbedPage */ app )
        {
            // on init hook to StorageEvent
            // in StorageEvent pass through only own to `epaWin` object
            function eachKey( cb )
            {   let p = app.getEpaPrefix()
                ,   i = storage.length-1;
                for( ; i>=0; i-- )
                    if( !storage.key(i).indexOf(p) )
                        cb( storage.key(i).substring( p.length ) );
            }
            defProperty( this, 'length', x =>
            {   let ret = 0;
                eachKey( x=> ret++ );
                return ret;
            });
            defProperty( this, 'key'   , idx =>
            {   let i=0, ret = null;
                eachKey( k => i++ === idx && ( ret = k ) );
                return ret;
            });
            const execute = ( op, key = null, val = null )=>
            {
                const k = app.getEpaPrefix() + key
                ,oldVal = key && this.getItem( k )
                ,    ev = new StorageEvent( "storage" );

                if( "setItem" === op )
                    storage.setItem( k, val );
                else if( "removeItem" === op )
                    storage.removeItem( k );
                else // clear
                    eachKey( k => storage.removeItem( app.getEpaPrefix() + k ) );

                ev.initStorageEvent( "storage", !1, !1, k, oldVal, val, app.src, this );
                ev.epa_uid = app.uid;
                try{  win.dispatchEvent( ev ) }
                catch( ev ){ console.error(ev) }
            };
            this.getItem    =     k => storage.getItem( app.getEpaPrefix()+k );
            this.setItem    = (k,v) => k &&    execute('setItem', k, v );
            this.removeItem =     k => k &&    execute('removeItem', k );
            this.clear      = x => execute( 'clear' );
            defProperty( this, 'configurable',x=>false );
            defProperty( this, 'enumerable'  ,x=>true  );
        }
    }

    class EpaWindow
    {
        constructor( /** EmbedPage */ app, a )
        {   const h = new EpaHrefLocationHolder(app,a)
            ,    ls = new EpaStorageWrapper( win.localStorage  , this, app )
            ,    ss = new EpaStorageWrapper( win.sessionStorage, this, app )
            ,parentLoc = doc.createElement('a')
            ,  hostWin = {   postMessage:(message, targetOrigin, transfer)=> postMessageTo( message, targetOrigin, transfer, h.href, win )
                         ,   location: parentLoc
                         ,   name: app.name
                         ,   target: app.target
                         };
            let closed;
            parentLoc.href = win.location.href;
            defProperty( this, 'location', x=> h, v=> ( (app.src = v), h ) );
            defProperty( this, 'localStorage'  ,x=> ls );
            defProperty( this, 'sessionStorage',x=> ss );
            defProperty( this, 'closed', x=> closed    );
            defProperty( this, 'name'  , x=> app.name  );
            defProperty( this, 'target', x=> app.target);
            defProperty( this, 'opener', x=>hostWin );
            defProperty( this, 'parent', x=>hostWin );
            defProperty( this, 'frames', x=> forEach( [ ...this.document.querySelectorAll('embed-page') ]
                                                         .map( f => f.window )
                                                       , (f,i,frames) => f.name && (frames[ f.name ] = f )));
            defProperty( hostWin, 'frames', x=> forEach( [ ...doc.querySelectorAll('embed-page') ]
                                                         .filter( f => f===app || app.target && f.target === app.target )
                                                         .map( f => f.window )
                                                       , (f,i,frames) => f.name && (frames[ f.name ] = f )));

            this.dispatchEvent = event => app.$.framed.dispatchEvent( event );
            this.addEventListener    = ( type, listener, useCapture, wantsUntrusted ) => app.$.framed.addEventListener   ( type, listener, useCapture, wantsUntrusted );
            this.removeEventListener = ( type, listener, useCapture, wantsUntrusted ) => app.$.framed.removeEventListener( type, listener, useCapture, wantsUntrusted );
            this.postMessage = ( message, targetOrigin, transfer )=> app.postMessage( message, targetOrigin, transfer );
            this.open = ( url, windowName="", windowFeatures={} ) =>
            {
                if( ["_self","_parent","_top"].includes(windowName) )
                {   app.src= url;
                    return app.contentWindow;
                }
                if( windowName && app.target )
                {   const trg = document.querySelector(`embed-page[name=${windowName}][target=${app.target}]`);
                    if( trg )
                    {   trg.src= url;
                        return trg.contentWindow;
                }   }
                const d = doc.createElement('div')
                ,     t = windowFeatures.target || this.target;
                d.innerHTML = `<embed-page src="${url}" name="${windowName}" target="${t}"></embed-page>`;
                return app.parentNode.insertBefore( d.firstElementChild, app.nextSibling ).contentWindow;// append after
            };
            this.close = x =>
            {   closed = true;
                app.remove();
            };
        }
        dispatchEvent( /** Event */ event ){}
        addEventListener( type, listener, useCapture, wantsUntrusted ){}
        open(url, windowName, windowFeatures ){} // https://developer.mozilla.org/en-US/docs/Web/API/Window/open
        close(){} // https://developer.mozilla.org/en-US/docs/Web/API/Window/close
    }

    class EpaCookie
    {   // todo combine window.localStorage & sessionStorage( no expires or "cookiename=value; expires=0; path=/";) to proxy cookies
        constructor( /** EpaWindow */ loc )
        {
            this.loc = loc;
        }
        set(v)
        {   const   c = EpaCookie.parse(v)
            ,     key = `EpaCookie-${c.key}`
            ,     val = JSON.stringify(c)
            ,       p = ( !c.attr.expires || '0' == c.attr.expires )
            ,     sto = p ? this.loc.sessionStorage : this.loc.localStorage
            ,     alt = p ? this.loc.localStorage   : this.loc.sessionStorage;
            sto.setItem( key, val );
            alt.removeItem( key );
            // todo remove cookie if expires is in past
        }
        toString(){ return "" }// todo

        static parse( str )
        {   // inspired by https://github.com/jshttp/cookie/blob/master/index.js
            let obj = { attr:{} },   pairs = str.split( /; */ );
            pairs.map( pair =>
            {
               let  eqi = pair.indexOf( '=' );

               if( eqi < 0 )
                   return { key: pair.trim() };

               let key = pair.substr( 0, eqi ).trim()
               ,   val = pair.substr( ++eqi, pair.length ).trim();

               if( '"' === val[ 0 ] ) // quoted values
                   val = val.slice( 1, -1 );
               return { key:key, val:val };
            }).map( (kw,i)=>
            {   if( i )
                {   if( undefined === obj[ key ] ) // only assign once
                        obj.attr[ key ] = tryDecode( val );
                }else
                   Object.assign( obj, kw )
            });

            return obj;

                function
            tryDecode( str )
            {   try{        return decodeURIComponent( str ) }
                catch( e ){ return str }
    }   }   }

    class EpaDocument
    {
        constructor( app, f, w )
        {   const zs = this
            , cookie = new EpaCookie(zs)
            ,      $ = ( css, el = app.$.framed )=> el.querySelectorAll( css );
            Object.assign( zs,
                {   getElementById         : x=> $( '#'+x, f )[0]
                ,   getElementsByTagName   : x=> $( x, f )
                ,   getElementsByClassName : x=> f.getElementsByClassName( x )
                ,   createElement          : x=> doc.createElement(x)
                ,   createEvent            : x=> doc.createEvent(x)
                ,   querySelectorAll       : x=> f.querySelectorAll(x)
                ,   querySelector          : x=> f.querySelector(x)
                ,   addEventListener       : (...args) => w.addEventListener(...args)
                ,   getRootNode            : x=> f
                ,   write       : x=> console.error( 'document.write() is not supported yet.')
                ,   scripts     : []
                });

            let currentScript;
            zs.setCurrentScript = v=> currentScript = v;
            defProperty( zs, 'sessionStorage' , x=> w.sessionStorage );
            defProperty( zs, 'localStorage'   , x=> w.localStorage   );
            defProperty( zs, 'location'       , x=> w.location       , v=> w.location = v );
            defProperty( zs, 'documentURI'    , x=> w.location       ); // https://html.spec.whatwg.org/multipage/history.html#the-location-interface
            defProperty( zs, 'URL'            , x=> w.location       );
            defProperty( zs, 'body'           , x=> f );
            defProperty( zs, 'cookie'         , x=> cookie.toString(), v=> cookie.set(v) );
            // defProperty( zs, 'currentScript'  , x=> currentScript, zs.setCurrentScript );

            const epaDoc = createDocument(  );
            // marshal undefined yet properties to epaDoc
            Object.keys( epaDoc ).forEach( k => (k in zs) || defProperty( zs, k, x=>epaDoc[k], v=>epaDoc[k]=v ) );

            function createDocument() // https://dom.spec.whatwg.org/#document
            {
                let   url = f.src
                , baseURI = ( url && ABS_URL.test(url) ) ? url : doc.baseURI || win.location.href;
                //  new Document()
                const d = doc.implementation.createHTMLDocument('epa');
                d.base  = d.createElement('base');
                d.base.href = baseURI;
                d.head.appendChild(d.base);
                d.anchor = d.createElement('a');
                d.body.appendChild(d.anchor);
                d.anchor.href = f.src;

                // d.body = app.$.framed;
                // document.domain
                // document.origin
                return d;
            }
        }
    }

    /**
     * `embed-page`
     * Proof of concept for Embeddable Progressive Application -
     * a microapplication container, a WebComponent acting as seamless IFRAME
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    class EmbedPage extends PolymerElement
    {
        static get is() { return 'embed-page' }

        static get properties()
        {
            return  {   src:    {   type: String
                                ,   value: undefined
                                ,   observer: 'fetch'
                                }
                    ,   html:   {   type: String
                                ,   value: ''
                                ,   observer: 'onHtmlAttrChange'
                                }
                    ,readyState:{   type: String
                                ,   value: 'loading'
                                                // https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
                                                // loading when src or html changed
                                                // error when load from src failed
                                                // interactive when dom injected
                                                // complete when js executed
                                ,   readOnly: true
                                ,   reflectToAttribute: true // ready-state attribute
                                ,   notify: true // fires ready-state-changed and readystatechange events
                                }
                    ,   scope:  {   type: String    , value: 'instance' }
                    ,   name:   {   type: String    , value: ''         }
                    ,   target: {   type: String    , value: ''         }
                    ,redirects: {   type: Array     , value:  ()=>[]    }
                    ,      uid: {   type: String, reflectToAttribute: true }
                    };
        }
        static get template() {
            return html`
                <style>
                    :host { display: block; }
                    iframe{display: none;}
                </style>
                <div id="framed" ><slot name="slotted" id="slotted"><slot>...</slot></slot></div>
                <!--base target="target-frame"/-->
                <iframe id="targetframe" name$="target-frame[[getInstanceNum()]]" on-load="onTargetLoad" src=""></iframe>`;
        }
        constructor()
        {   super();
            const instanceNum = GBL_InstancesCount++
            ,   uid = instanceNum+'_'+Date.now()
            ,     A = doc.createElement('a');
            A.toString = function(){ return this.href };

            this.uid = uid ;
            defProperty( this, 'instanceNum' , x=> instanceNum );
            defProperty( this, '_A'  , x=> A );
        }

        connectedCallback()
        {   super.connectedCallback();
            this.watchHtml(1);
        }
        ready()
        {   super.ready();

            const //body = doc.createElement('body'),
                src = this.src || '';
            // body.appendChild( this.$.framed.firstChild );
            // this.$.framed = body;

            this._A.href = src;

            const scoped = this.isScoped()
            ,     f = this.$.framed
            ,     w = scoped ? new EpaWindow( this, this._A ) : win
            ,     d = scoped ? new EpaDocument( this, f, w  ) : doc ;
            defProperty( this, 'window'         , x=> w );
            defProperty( this, 'contentWindow'  , x=> w );
            defProperty( this, 'document'       , x=> d );
            scoped && defProperty( w, 'document', x=> d );
            f.epa = this;

            win.addEventListener('storage', e =>
            {   const pr = this.getEpaPrefix();
                if( !e.key || !e.key.startsWith( pr ) || this.uid === e.epa_uid )
                    return;
                var   key = e.key.substring( pr.length )
                //,     url = e.url.substring( pr.length )
                ,  origin = pr.substring( 5, pr.length-6 )
                ,       a = this.document.createElement('a');

                a.setAttribute('href',origin);
                const dispatch = b=>
                {   if( !b )
                        return;
                    const ev = new StorageEvent( e.type );
                    ev.initStorageEvent( e.type, e.bubbles, e.cancelBubble, key, e.oldValue, e.newValue, origin, e.storageArea );
                    try{  w.dispatchEvent( ev ) }
                    catch( ev ){ console.error(ev) }
                };
                switch( this.scope )
                {   case 'none'     :   return undefined;
                    case 'named'    :   return dispatch( this.name === origin );
                    case 'page'     :   return dispatch( this.window.location.pathname === a.pathname );
                    case 'host'     :   return dispatch( this.window.location.hostname === a.hostname );
                    case 'domain'   :   return dispatch( host2domain( this.window.location.hostname ) === host2domain( a.hostname ) );
                    case 'instance' :   ;
                    default         :   return undefined;
                }
            });

            if( this.childNodes.length )
            {
                this.onHtmlChange();
            }
            if( this.src )
            {
                this.fetch();
            }else if( !this.html && !this.childNodes.length )
            {
                this.onHtmlAttrChange();
            }
            scoped && this.$.framed.addEventListener( 'click', this._onClick.bind(this), true );

            let sh= this.$.slotted;

            const slot = sh.querySelector('slot');
            slot.addEventListener('slotchange', e =>
                {   setTimeout( ()=>  this.onSlotChanged(), 0 ) });
            //this.$.slot.addEventListener('slotchange', this.onSlotChanged.bind(this));
        }
        getInstanceNum(){ return this.instanceNum }
        isScoped(){ return this.scope !== 'none' }
        inScope( url )
        {   const a = this.document.createElement('a');
            a.setAttribute( 'href',url );
            switch( this.scope )
            {   case 'none'     :   return true;
                case 'named'    :   return false;
                case 'page'     :   return this.window.location.pathname === a.pathname;
                case 'host'     :   return this.window.location.hostname === a.hostname;
                case 'domain'   :   return host2domain( this.window.location.hostname );
                case 'instance' :   ;
                default         :   return false;
            }
        }
        getEpaPrefix()
        {   const f = x=>
            {   switch( this.scope )
                {   case 'none'     :   return '';
                    case 'named'    :   return this.name || this.id ;
                    case 'page'     :   return this.window.location.hostname+this.window.location.pathname ;
                    case 'host'     :   return this.window.location.hostname ;
                    case 'domain'   :   return host2domain( this.window.location.hostname );
                    case 'instance' :   ;
                    default         :   return this.uid;
                }
            };
            return `<EPA>${ f() }</EPA>`;
        }
        getCreateInlineElement(){ return this.inlineElement || this.appendChild( this.inlineElement = doc.createElement('div') ) }
        watchHtml( boolWatch )
        {   if(!this._mutationObserver )
                this._mutationObserver = new MutationObserver( mutationsList => this.onHtmlChange() );
            boolWatch ? this._mutationObserver.observe( this, { attributes: false, childList: true })
                      : this._mutationObserver.disconnect();
        }

        _loadHtml( html )
        {   try
            {   this.watchHtml(0);
                if( !this.isScoped() )
                {
                    const el     = this.getCreateInlineElement();
                    el.innerHTML = html;
                    this.onAfterLoad();
                    let $s       = $( scriptsSelector, el );
                    return this.runScriptsRaw( [ ... $s ] );
                }
                const f = this.isScoped() ? (this.$f = this.$.framed) : this.getCreateInlineElement();
                let el       = doc.createElement( 'div' );
                el.innerHTML = html;
                this.onAfterLoad();
                // todo link[rel=stylesheet] to <style> @import "../my/path/style.css"; </style>
                let $s       = $( scriptsSelector, el );// skip detach() as code could expect script tags present;
                f.innerHTML  = '';
                f.appendChild( el );
                return this.runScripts( $s );
            }finally
                {  this.watchHtml(1); }
        }

        fetch()
        {
            if( !this.document )
                return;
            const f = this.$f = this.$.framed;
            this._A.href = this.src;

            this.onBeforeLoad();
            this.src && ajax( this.src )
                .then( t =>
                    {   this._loadHtml(t);
                    }, err =>
                    {   f.innerHTML =  "Technical error";
                        this._setReadyState('error');
                    });
        }
        onBeforeLoad(){ addClass   ( this.$.framed,'loading');this._setReadyState('loading') }
        onAfterLoad (){ removeClass( this.$.framed,'loading');this._setReadyState('interactive') }

        onHtmlChange()
        {   this.onBeforeLoad();
            if( this.html )
                this._loadHtml( this.html );
            else
                this._loadHtml( this.innerHTML.trim().replace('<template>','').replace('</template>','') );
        }
        onHtmlAttrChange()
        {   if( !this.document )
                return;
            this.onBeforeLoad();
            if( this.html )
                this._loadHtml( this.html );
            else
                this._loadHtml( this.innerHTML.trim().replace('<template>','').replace('</template>','') );
        }
        onSlotChanged()
        {
            // console.log("onSlotChanged");
        }

        postMessage( message, targetOrigin, transfer )
            {   return postMessageTo( message, targetOrigin, transfer, this._A.href, this.$.framed );  }
        get promise()
        {   if( "complete" === this.readyState )
                return Promise.resolve(this);
            return this.promiseNext;
        }
        get promiseNext()
        {   const zs = this;
            return new Promise( function( resolve, reject )
            {   zs.addEventListener( 'error' , _onError );
                zs.addEventListener( 'load'  , _onLoad  );
                    function
                _onLoad( ev )
                {   try{ resolve(zs); }
                    finally { releaseEv(); }
                }
                    function
                _onError( err )
                {   try{ reject(err); }
                    finally { releaseEv(); }
                }
                    function
                releaseEv()
                {   zs.removeEventListener('load' , _onLoad  );
                    zs.removeEventListener('error', _onError );
                }
            });
        }
        get context()
        {   return  {   window          : this.window
                    ,   document        : this.document
                    ,   location        : this.window.location
                    ,   localStorage    : this.window.localStorage
                    ,   sessionStorage  : this.window.sessionStorage
                    ,   parent          : this.window.parent
                    ,   frames          : this.window.frames
                    ,   epc             : this
                    } // sync code w/ runScriptAs
        }
        preparseScript(srciptText){ return EPA_PreparseScript(srciptText) }
        runScripts( /** @type {!NodeList} */ pageScripts, { win, document, location, head, body } = this.context )
        {   const env = this.context;
            EPA_runScript( [...pageScripts], env, this.redirects );
        }
        runScriptsRaw( arr )
        {
            const currentScript = arr.shift();
            const createEv = (x,type)=>(x=document.createEvent(x),x.initEvent(type, false, false),x);
            if( !currentScript )
            {
                try { window.dispatchEvent ( createEv('Event','DOMContentLoaded') );}
                catch(ex)
                    { console.error(ex); }
                const env = this.context;
                env.epc._setReadyState('complete');
                env.epc.dispatchEvent( createEv('Event','load') );
                return;
            }
            const s = currentScript;

            if( !s.src )
            {
                runScriptAs( s, s.textContent, this  ).then( x=>this.runScriptsRaw( arr ) );
            }else
                ajax( urlRedirectMap( currentScript.src, this.redirects ) )
                .then( txt => runScriptAs( s, txt, this ),   err => {debugger;}  )
                .then( x=>this.runScriptsRaw( arr ) );

        }
        _prepareTarget( el, attr ) // return embed-page if target defined explicitly
        {   var v = el.getAttribute(attr)
            ,   t = el.getAttribute('target');
            if( 'href' === attr )
            {
                if( !v )// is anchor
                    return; // todo scroll to target
                if( t )
                    return this.contentWindow.open( v, t );

                if( '#' === v.charAt(0) )
                {
                    // todo local anchor #link
                }
            }
            el.target = this.$.targetframe.getAttribute( 'name' );
            if( !v )
                el.setAttribute( attr, this.src );
        }
        _onClick(ev)
        {   const $f = this.$.framed;
            for( let el = ev.target; el && el!==$f ; el = el.parentElement )
            {   const a = { A:'href', FORM:'action'}[ el.tagName ];
                if( a )
                    if( this._prepareTarget( el, a ) )
                        ev.preventDefault();
            }
        }
        onTargetLoad(ev)
        {
            const   fr  = ev.target
            ,       url = fr.contentWindow.location.href;
            if( url.includes(FRAME_BLANK) )
                return;
            fr.src = FRAME_BLANK;
            this.src = url;
        }
    }// =- EmbedPage

    const HTMLFormElement_submit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function ()
    {
        for( let el = this.parentElement; el ; el = el.parentNode )
            if( el.epa )
            {   if( el.epa.isScoped() )
                {   this.target = el.epa.$.targetframe.getAttribute( 'name' );
                    el.epa._setReadyState( 'loading' );
                }
                break;
            }
        return HTMLFormElement_submit.apply( this, arguments );
    };

    const scriptsSelector = 'script:not([type]),script[type="application/javascript"],script[type="text/javascript"],script[type="module"]';

    win.customElements.define( EmbedPage.is, EmbedPage );

    return EmbedPage;

    function log( ...args  ){ console.log(...args); }
    function forEach(arr,cb){ let ret = [...arr]; ret.forEach(cb); return ret;}
    function $( css, el = doc ){ return el.querySelectorAll( css ) }
    function addClass   ( el, className  ){ el.className += ' '+className    }
    function removeClass( el, className  ){ el.className = el.className.split(' ').map(s=>s===className?'':s).join(' ') }
    function host2domain( hostname ){ return hostname.split('.').splice(-2,2).join('.') }
    function postMessageTo( message, targetOrigin, transfer, origin, dispatcher )
    {   const cloned = JSON.parse( JSON.stringify(message) ) //  Components.utils.cloneInto
        ,   event = new MessageEvent("message", {   data: cloned,   origin: origin,   lastEventId:"" /*, source */ ,   ports: [] });
        dispatcher.dispatchEvent( event )
    }
        function
    cloneScript( s, exclude )
    {   const c = s.ownerDocument.createElement('script');
        forEach( s.attributes, attr => attr.name !== exclude && c.setAttribute(attr.name, attr.value) );
        c.async = s.async;
        c.defer = s.defer;
        return c;
    }
        function
    runScriptAs( s, txt, epc )
    {
        return new Promise( ( resolve, reject ) =>
        {
            const createEv = (x,type)=>(x=document.createEvent(x),x.initEvent(type, false, false),x);
            const c0 = cloneScript( s, 'src' );
            c0.setAttribute('epa-script-id', ++GBL_ScriptsCount );
            c0.setAttribute('type', 'module');
            c0.orig_src = s.src;
            c0.id = 'testing';
            c0.defer = true;
            c0.async = true;
            s.src && Object.defineProperty( c0, 'src', { get:()=>s.src, enumerable: false, configurable:false });

            const c = epc.context
            ,     d = c.document;
            c0.addEventListener( 'load' , x=> resolve(c0) );
            c0.addEventListener( 'error', x=> reject (c0) );
            // Object.defineProperty( d, 'currentScript',{ get: ()=>c0, enumerable: false, configurable:true} );
            c.EPA_PreparseScript = EPA_PreparseScript;
            c.currentScript = c0;
            c.trackExecution = function(){ this.scriptExecutionTimer = setTimeout( ()=>c0.dispatchEvent ( createEv('Event','error') )) };
            c.onScriptExecuted = function(){ clearTimeout( this.scriptExecutionTimer); c0.dispatchEvent ( createEv('Event','load') )};
            window[ 'epa_'+epc.uid ] = c;

            c0.textContent = `
const
{   window
,   document
,   location        
,   localStorage    
,   sessionStorage
,   parent          
,   frames
,   EPA_PreparseScript
} = epa_${epc.uid}; 
const epa_getCurrentScript = ()=>epa_${epc.uid}.currentScript;
const epa_currentScript = epa_getCurrentScript();
if( !epa_currentScript )
    {debugger;}
Object.defineProperty( document, 'currentScript',{ get: epa_currentScript, enumerable: false, configurable:true} );
epa_${epc.uid}.trackExecution();

`
                    // .replace( /\n/g , '')
                + EPA_PreparseScript( txt ) +
` ; epa_${epc.uid}.onScriptExecuted();
//# sourceURL=` + s.src ;

            try
            {   let p = s.parentNode;
                p.insertBefore( c0, s );
                p.removeChild( s );
                s.src && c0.setAttribute( 'src', s.getAttribute('src') );
            }catch( ex )
            {   console.error( ex );
                reject( ex )
            }
            // resolve(c0);
        })
    }
        function
    timeoutPromise( ms )
    {
        return new Promise( resolve=> setTimeout( resolve, ms ) )
    }

    function EPA_PreparseScript( s )
    {
        const s1 =  s.replace( /(^|[\{\}\\;\(\)\,])(\s*)(location\s*=)/g , '$1 location.href=');
        // converting eval(expr) to  eval(EPA_PreparseScript( expr ))
        const ev= s1.split( /(^|\W)(eval\s*\()/g );

        return ev.map( (si,i,arr) =>
        {   if( !si.startsWith('eval') )
                return si;
            const s=si+arr[i+1];
            arr[i+1]="";
            let start = s.indexOf( '(' )
            ,     end = seekChar( ')',s, start+1 );
            if( end < 0 )
                return s;
            return 'eval(EPA_PreparseScript' + s.substring(start,end) + '))'+s.substring(end+1);
        }).join('');

        function seekChar( c, s, start ) // position of character
        {   let i=start;
            for( ; i<s.length ; i++ )
            {   if( s.startsWith('/*',i) )      // skip comment /* */
                    i = seekChar( '*/',s,i+2 )+2;
                else if( s.startsWith('//',i) ) // skip comment // ...
                    i = seekChar( '\n',s,i+2 )+1;
                if( s.charAt(i)==='(' )
                    i = seekChar( ')',s,i+1 )+1;
                if( s.startsWith(c,i) )
                    return i;
            }
            return -1
        }
    }
    function urlRedirectMap( src, redirects )
    {
        let url = src;
        let m = redirects.find( m => url.startsWith( m.from ) );
        if( m )
            url = m.to + url.substring( m.from.length );
        return url;
    }
    // outside of class to avoid strict mode
    function EPA_runScript( arr, env, redirects )
    {   const { window, document, location,localStorage, sessionStorage, parent, frames } = env;
        const currentScript = arr.shift();
        const createEv = (x,type)=>(x=document.createEvent(x),x.initEvent(type, false, false),x);
        if( !currentScript )
        {
            try { window.dispatchEvent ( createEv('Event','DOMContentLoaded') );}
            catch(ex)
                { console.error(ex); }

            env.epc._setReadyState('complete');
            window.dispatchEvent ( createEv('Event','load') );
            env.epc.dispatchEvent( createEv('Event','load') );
            return;
        }
        currentScript.getRootNode = x => document.getRootNode();
        document.scripts.push       && document.scripts.push( currentScript );

        (   currentScript.src
            ?   (   ajax( urlRedirectMap( currentScript.src, redirects ) )
                    .then( txt => runScriptAs( currentScript, txt, env.epc ) )
                )
            :   runScriptAs( currentScript, currentScript.text, env.epc  ) // todo src map
        ).finally( x => EPA_runScript( arr, env, redirects ) );
    }

    function ajax( url, method = "GET", headers = {}, body = undefined )
    {
        return new Promise( ( resolve, reject ) =>
                            {   const xhr = new XMLHttpRequest();
                                xhr.open( method, url );
                                headers && Object.keys( headers ).forEach( key => xhr.setRequestHeader( key, headers[ key ] ) );

                                xhr.onload  = () =>
                                {   if( xhr.status >= 200 && xhr.status < 300 )
                                    resolve( xhr.response );
                                else
                                    reject( xhr.statusText );
                                };
                                xhr.onerror = () => reject( url + 'failed' +xhr.statusText );
                                xhr.send( body );
                            })
    }
    function defProperty( obj, name, getter, setter=getter  )
    {
        Object.defineProperty( obj, name,{ get: getter, set: setter, enumerable: false, configurable:false } )
    }

    class EmbedPage0 extends HTMLElement
    {
        constructor()
        {
            super();
            const shadowRoot     = this._shadowRoot = this.attachShadow( { mode: 'open' } );
            shadowRoot.innerHTML = `<div id="framed" >
                                        <div id="content"></div>
                                        <div name="slotted" id="slotted">
                                            <slot>...</slot>
                                        </div>
                                    </div>`;
            addObservers( this, "this");
        }
        connectedCallback()
        {   //super.connectedCallback();
            console.log( "connectedCallback" );
            const shadowRoot = this._shadowRoot
            ,           slot = shadowRoot.querySelector('#slotted slot');

            addObservers( slot, "slot");
            slot.addEventListener('slotchange', e =>
            {
                console.log( 'slotchange', slot );
                let newContent = slot.assignedNodes()[0];
                addObservers( newContent, "slot.assignedNodes");
            });
            //const t = this.firstElementChild && "TEMPLATE" === this.firstElementChild.nodeName && this.firstElementChild.innerHTML;
            //t && setContent( t );
        }
    }
    customElements.define('embed-page0', EmbedPage0);
    return EmbedPage;
})( window||globals, document );
//});
