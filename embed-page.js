//export default
( function( win, doc )
{
    const   FRAME_HASH_PREFIX   = '#embed-page='
    ,       FRAME_BLANK         = "about:blank";
    let     GBL_InstancesCount  = 0;

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
        constructor( /** Storage */ storage, /** EpaWindow */ win, /** EmbedPage */ app )
        {
            // on init hook to StorageEvent
            // in StorageEvent pass through only own to `win` object
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
            {   let i=0; ret = null;
                eachKey( k => i++ === idx && ( ret = k ) );
                return ret;
            });
            this.getItem = k => storage.getItem( app.getEpaPrefix()+k );
            this.setItem = (k,v) => k &&    storage.setItem   ( app.getEpaPrefix() + k, v );
            this.removeItem =  k => k &&    storage.removeItem( app.getEpaPrefix() + k );
            this.clear = x => eachKey( k => storage.removeItem( app.getEpaPrefix() + k ) );
            defProperty( this, 'configurable',x=>false );
            defProperty( this, 'enumerable'  ,x=>true  );
        }
    }
    class EpaWindow
    {
        constructor( /** EmbedPage */ app, a )
        {   const h = new EpaHrefLocationHolder(app,a)
            ,    ls = new EpaStorageWrapper( win.localStorage  , this, app )
            ,    ss = new EpaStorageWrapper( win.sessionStorage, this, app );
            defProperty( this, 'location', x=> h, v=> ( (app.src = v), h ) );
            defProperty( this, 'localStorage'  ,x=> ls );
            defProperty( this, 'sessionStorage',x=> ss );
            window.addEventListener('storage', e =>
            {   const pr = app.getEpaPrefix();
                if( !e.key || !e.key.startsWith( pr ) )
                    return;
                const key = e.key.substring( pr.length )
                ,      ev = new StorageEvent( e.type );
                ev.initStorageEvent( e.type, e.bubbles, e.cancelBubble, key, e.oldValue, e.newValue, e.url, e.storageArea );
                try{  this.dispatchEvent( ev ) }
                catch( ev ){ console.error(ev) }
            });
            this.dispatchEvent = event => app.$.framed.dispatchEvent( event );
            this.addEventListener = ( type, listener, useCapture, wantsUntrusted ) => app.$.framed.addEventListener( type, listener, useCapture, wantsUntrusted );
        }
        dispatchEvent( /** Event */ event ){}
        addEventListener( type, listener, useCapture, wantsUntrusted ){}
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

               if( '"' == val[ 0 ] ) // quoted values
                   val = val.slice( 1, -1 );
               return { key:key, val:val };
            }).map( (kw,i)=>
            {   if( i )
                {   if( undefined == obj[ key ] ) // only assign once
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
        {   const cookie = new EpaCookie(this)
            ,   $ = ( css, el = app.$.framed )=> el.querySelectorAll( css );
            Object.assign( this,
                           {   getElementById         : x=> $( '#'+x, f )[0]
                           ,   getElementsByTagName   : x=> $( x, f )
                           ,   getElementsByClassName : x=> f.getElementsByClassName( x )
                           ,   createElement          : x=> doc.createElement(x)
                           ,   createEvent            : x=> doc.createEvent(x)
                           ,   querySelectorAll       : x=> f.querySelectorAll(x)
                           ,   querySelector          : x=> f.querySelector(x)
                           ,   write       : x=> console.error( 'document.write() is not supported yet.')
                           });

            defProperty( this, 'sessionStorage' , x=> w.sessionStorage );
            defProperty( this, 'localStorage'   , x=> w.localStorage   );
            defProperty( this, 'location'       , x=> w.location       , v=> w.location = v );
            defProperty( this, 'cookie'         , x=> cookie.toString(), v=> cookie.set(v) );
        }
    }

    /**
     * `embed-page`
     * embeds page in iframe fashion but using shadow dom for CSS, dom insulation, and closure for JS jailing.
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    class EmbedPage extends Polymer.Element
    {
        static get is() { return 'embed-page' }

        static get properties()
        {
            return  {   src:    {   type: String
                                ,   value: ''
                                ,   observer: 'fetch'
                                }
                    ,   html:   {   type: String
                                ,   value: ''
                                ,   observer: 'onHtmlAttrChange'
                                }
                    ,   scope:  {   type: String
                                ,   value: 'instance'
                                }
                    ,   name:   {   type: String
                                ,   value: ''
                                }
                    ,redirects: {   type: Array
                                ,   value:  ()=>[]
                                }
                    };
        }
        static get template() {
            return Polymer.html`
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

            defProperty( this, 'instanceNum' , x=> instanceNum );
            defProperty( this, 'uid' , x=> uid );
            defProperty( this, '_A'  , x=> A );
        }

        connectedCallback()
        {   super.connectedCallback();
            this.watchHtml(1);
        }
        ready()
        {   super.ready();
            this._A.href=this.src;

            const scoped = this.isScoped()
            ,     f = this.$.framed
            ,     w = scoped ? new EpaWindow( this, this._A ) : win
            ,     d = scoped ? new EpaDocument( this, f, w  ) : doc ;
            defProperty( this, 'window'   , x=> w );
            defProperty( this, 'document' , x=> d );

            this.onHtmlAttrChange();
            if( this.src )
                this.fetch();

            scoped && this.$.framed.addEventListener( 'click', this._onClick.bind(this), true );

            let sh= this.$.slotted;

            const slot = sh.querySelector('slot');
            slot.addEventListener('slotchange', e =>
                {   setTimeout( ()=>  this.onSlotChanged(), 0 ) });
            //this.$.slot.addEventListener('slotchange', this.onSlotChanged.bind(this));
        }
        getInstanceNum(){ return this.instanceNum }
        isScoped(){ return this.scope !== 'none' }
        getEpaPrefix()
        {   const f = x=>
            {   switch( this.scope )
                {   case 'none'     :   return '';
                    case 'named'    :   return this.name || this.id ;
                    case 'page'     :   return this.window.location.pathname ;
                    case 'host'     :   return this.window.location.hostname ;
                    case 'domain'   :   return this.window.location.hostname.split('.').splice(-2,2).join('.') ;
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
                    let $s       = $( scriptsSelector, el );
                    return this.runScriptsRaw( [ ... $s ] );
                }
                const f = this.isScoped() ? (this.$f = this.$.framed) : this.getCreateInlineElement();
                let el       = doc.createElement( 'div' );
                el.innerHTML = html;
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
            this.onBeforeLoad();
            this._A.href = this.src;
            this.src && ajax( this.src )
                .then( t =>
                       {   this._loadHtml(t);
                           this.onAfterLoad();
                       }, err => f.innerHTML =  "Technical error" );
        }
        onBeforeLoad(){ addClass   ( this.$.framed,'loading') }
        onAfterLoad (){ removeClass( this.$.framed,'loading') }

        onHtmlChange()
        {   this.onBeforeLoad();
            if( this.html )
                this._loadHtml( this.html );
            else
                this._loadHtml( this.innerHTML.trim().replace('<template>','').replace('</template>','') );
            this.onAfterLoad();
        }
        onHtmlAttrChange()
        {   if( !this.document )
                return;
            this.onBeforeLoad();
            if( this.html )
                this._loadHtml( this.html );
            else
                this._loadHtml( this.innerHTML.trim().replace('<template>','').replace('</template>','') );
            this.onAfterLoad();
        }
        onSlotChanged()
        {
            console.log("onSlotChanged");
        }
        get context()
        {   return  {   window      : this.window
                    ,   document    : this.document
                    }
        }

        runScripts( /** @type {!NodeList} */ pageScripts, { win, document, head, body } = this.context )
        {   const env = this.context;
            EPA_runScript( [...pageScripts], env, this.redirects );
        }
        runScriptsRaw( $scripts )
        {
            forEach( $scripts, s =>
            {   const clone = /** @type {!HTMLScriptElement} */( s.ownerDocument.createElement('script') );
                forEach(s.attributes, attr => clone.setAttribute(attr.name, attr.value));
                clone.textContent = s.textContent;
                s.parentNode.insertBefore(clone, s);
                s.parentNode.removeChild(s);
            });
        }
        _prepareTarget( el, attr )
        {   var v = el.getAttribute(attr);
            if( 'href' === attr )
            {
                if( !v )// is anchor
                    return;
                if( '#' === v.charAt(0) )
                {
                    // todo local anchor #link
                    return
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
                    return this._prepareTarget( el, a );
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
    }
    const scriptsSelector = 'script:not([type]),script[type="application/javascript"],script[type="text/javascript"]';

    win.customElements.define( EmbedPage.is, EmbedPage );

    return EmbedPage;

    function log( ...args  ){ console.log(...args); }
    function forEach(arr,cb){[...arr].forEach(cb)}
    function $( css, el = doc ){ return el.querySelectorAll( css ) }
    function addClass   ( el, className  ){ el.className += ' '+className    }
    function removeClass( el, className  ){ el.className = el.className.split(' ').map(s=>s===className?'':s).join(' ') }


    // outside of class to avoid strict mode
    function EPA_runScript( arr, env, redirects )
    {   let { window, document, head, body } = env;
        let currentScript = arr.shift();
        if( !currentScript )
            return;
console.debug( "embed-page", currentScript.src || currentScript.text );
        if( currentScript.src )
        {
            let url = currentScript.src;

            let m = redirects.find( m => url.startsWith( m.from ) );
            if( m )
                url = m.to + url.substring( m.from.length );
            ajax( url )
                .then( txt => runScript.call( window, txt + "//# sourceURL=" + currentScript.src ) );
        }else
            runScript.call( window, currentScript.text );// todo src map

        function runScript( txt )
        {   try
            {   with( window )
                {
                    eval(txt);
                }
            }catch(ex){ console.error(ex) }
            setTimeout( x=> EPA_runScript( arr, env, redirects ), 0 );
        }
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
