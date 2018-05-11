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
        replace     (v){ return this.setHref( v ) }
        reload(){ this.setHref(''); return this.setHref( this.getHref() ) }
    }
    class EpaStorageWrapper
    {
        // todo Window.onstorage event handler that fires when a storage area changes
        constructor( /** Storage */ storage, /** EpaWindow */ win, /** EmbedPage */ app )
        {
            // on init hook to StorageEvent
            // in StorageEvent pass through only own to `win` object
            function eachKey( cb )
            {   let p = app.epaPrefix
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
            this.getItem = k => storage.getItem( app.epaPrefix+k );
            this.setItem = (k,v) => k &&    storage.setItem   ( app.epaPrefix + k, v );
            this.removeItem =  k => k &&    storage.removeItem( app.epaPrefix + k );
            this.clear = x => eachKey( k => storage.removeItem( app.epaPrefix + k ) );
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
            window.addEventListener('storage', function(event)
            {   const pr = app.epaPrefix;
                if( !event.key.startsWith( pr ) )
                    return;
                event.key = event.key.substring( pr.length );
                this.dispatchEvent( event );
            });
            this.dispatchEvent = event => app.$.framed.dispatchEvent(event);
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
        {   const cookie = new EpaCookie(this);
            Object.assign( this,
                           {   getElementById         : x=> $( '#'+x, f )[0]
                               ,   getElementsByTagName   : x=> $( x, f )
                               ,   getElementsByClassName : x=> f.getElementsByClassName( x )
                               ,   createElement          : x=> doc.createElement(x)
                               ,   querySelectorAll       : x=> f.querySelectorAll(x)
                               ,   querySelector          : x=> f.querySelector(x)
                               ,   write       : x=> console.error( 'document.write() is not supported yet.')
                           });

            defProperty( this, 'sessionStorage' , x=> win.sessionStorage );
            defProperty( this, 'localStorage'   , x=> win.localStorage   );
            defProperty( this, 'location'       , x=> w.location        , v=> w.location = v );
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
                <div id="framed" ><slot name="slotted" id="slotted">~<slot>...</slot>~</slot></div>
                <!--base target="target-frame"/-->
                <iframe id="targetframe" name$="target-frame[[getInstanceNum()]]" on-load="onTargetLoad" src=""></iframe>`;
        }
        constructor()
        {   super();
            const instanceNum = GBL_InstancesCount++;
            defProperty( this, 'instanceNum' , x=> instanceNum );
            const a = doc.createElement('a');
            a.href  = this.src;
            a.toString = function(){ return this.href };
            const win = new EpaWindow(this,a);
            defProperty( this, 'window'   , x=> win );
            defProperty( this, 'epaPrefix', x=> `<EPA>${win.location.hostname}:${this.instanceNum}</EPA>` );
        }

        connectedCallback()
        {   super.connectedCallback();
            new MutationObserver( mutationsList => this.onHtmlChange() ).observe( this, { attributes: false, childList: true });
        }
        getInstanceNum(){ return this.instanceNum }
        _loadHtml( html )
        {   const f = this.$f = this.$.framed;
            let el = doc.createElement('div');
            el.innerHTML =  html;
            // todo link[rel=stylesheet] to <style> @import "../my/path/style.css"; </style>
            let $s = $( scriptsSelector, el );// skip detach() as code could expect script tags present;
            f.innerHTML='';
            f.appendChild( el );
            this.runScripts( $s );
        }

        fetch()
        {   const f = this.$f = this.$.framed;
            this.onBeforeLoad();
            this.src && ajax( this.src )
                .then( t =>
                       {   this._loadHtml(t);
                           this.onAfterLoad();
                       }, err => f.innerHTML =  "Technical error" );
        }
        onBeforeLoad(){ addClass   ( this.$f,'loading') }
        onAfterLoad (){ removeClass( this.$f,'loading') }

        onHtmlChange()
        {   debugger;
            this.onBeforeLoad();
            if( this.html )
                this._loadHtml( this.html );
            else
                this._loadHtml( this.innerHTML.trim().replace('<template>','').replace('</template>','') );
            this.onAfterLoad();
        }
        onHtmlAttrChange()
        {   this.onBeforeLoad();
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
        {   const f = this.$.framed;
            return  {   window      :   this.window
                    ,   document    :   new EpaDocument(this,f,win)
                    ,   head        : doc.head
                    ,   body        : doc.body
            }
        }

        runScripts( /** @type {!NodeList} */ pageScripts, { win, document, head, body } = this.context )
        {   const env = this.context;
            EPA_runScript( [...pageScripts], env, this.redirects );
        }
        runScriptsRaw( { window, document, head, body } = this.context )
        {
            forEach( content.querySelectorAll(scriptsSelector), currentScript =>
            {   const clone = /** @type {!HTMLScriptElement} */( script.ownerDocument.createElement('script') );
                forEach(script.attributes, attr => clone.setAttribute(attr.name, attr.value));
                clone.textContent = script.textContent;
                script.parentNode.insertBefore(clone, script);
                script.parentNode.removeChild(script);
            });
        }
        ready()
        {   super.ready();
            this.$.framed.addEventListener( 'click', this._onClick.bind(this), true );

            let sh= this.$.slotted;

            const slot = sh.querySelector('slot');
            slot.addEventListener('slotchange', e => {
                console.log('light dom children changed!',slot);
                setTimeout( ()=>  this.onSlotChanged(), 0 )
            });
            //this.$.slot.addEventListener('slotchange', this.onSlotChanged.bind(this));
        }
        url2hash( el, attr )
        {   el.target = this.$.targetframe.getAttribute( 'name' );
            var v = el.getAttribute(attr);
            if( !v.includes(FRAME_HASH_PREFIX) )
                el.setAttribute( attr, FRAME_HASH_PREFIX+encodeURIComponent( v ) )
        }
        _onClick(ev)
        {   const $f = this.$.framed;
            for( let el = ev.target; el && el!==$f ; el = el.parentElement )
            {   const a = { A:'href', FORM:'action'}[ el.tagName ];
                if( a )
                    return this.url2hash( el, a );
                // todo POST handling
            }
        }
        onTargetLoad(ev)
        {
            const   fr  = ev.target
                ,       url = fr.contentWindow.location.href;
            if( url.includes(FRAME_BLANK) )
                return;

            const decoded = decodeURIComponent( url.substring( url.indexOf(FRAME_HASH_PREFIX)+FRAME_HASH_PREFIX.length ) );
            fr.src = FRAME_BLANK;
            this.src = decoded;
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
eval("console.log(typeof window, window, typeof location, location);");

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
