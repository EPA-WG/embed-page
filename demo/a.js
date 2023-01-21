
const EPA_local = EPA_2_1575348139759,
    EPA_loadCount = 1,
    EPA_PreparseScript = EPA_local.preparseScript,
    EPA_currentScript = EPA_local._scripts[3];
let EPA_EndScope, EPA_globals2Vars, EPA_vars2globals, EPA_StartScope;
var format;

const EPA_isVar = s => !s.startsWith('EPA_') && s !== 'window' && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(s);

if (EPA_loadCount === EPA_local.loadCount) try {
    EPA_globals2Vars = () => format=EPA_local.globals["format"];

    EPA_StartScope = () => {
        const restoreWindowState = EPA_local._sanitizeWindow();

        EPA_globals2Vars();
        let executed = 0;
        return function EPA_EndScope() {
            if (executed) {
                return;
            }

            executed = 1;
            EPA_vars2globals();
            [...EPA_local.getElementsByTagName('script')].forEach(s => s.EPA_vars2globals && s.EPA_vars2globals());
            restoreWindowState();

            EPA_local._onScriptDone(EPA_currentScript);
        };
    };

    const window = new Proxy(EPA_local.window, {
        set: (target, property, value
              /*, receiver*/
        ) => {
            return EPA_local.globals[property] = target[property] = typeof target[property] === 'undefined' ? value : eval(`${property}=value`);
        }
    });
    EPA_currentScript.EPA_funcs.forEach(w => {
        try {
            function EPA_script_scope_wrapper() {
                try {
                    const EPA_func = eval(w);
                    EPA_globals2Vars();
                    return EPA_func.apply(this, arguments);
                } finally {
                    EPA_vars2globals();
                }
            }

            EPA_script_scope_wrapper.EPA_script_scope_wrapper = 1;
            if (!(EPA_local.globals[w] || {}).EPA_script_scope_wrapper) EPA_local.globals[w] = EPA_script_scope_wrapper;
        } catch (e) {
            ;
        } // const renders "can't access lexical declaration XXX before initialization"

    });
    EPA_currentScript.EPA_vars2globals = EPA_vars2globals;
    EPA_EndScope = EPA_StartScope();
    if (true) EPA_local._handleEvent = function (ev, code
                                                 /*, eventAttr */
    ) {
        const EPA_EndScope = EPA_StartScope();

        try {
            eval(code);
        } finally {
            EPA_EndScope();
        }
    };
    var document = window.document;
    document.setCurrentScript(EPA_currentScript); //####################################

    // Binds one dom element text or attribute to another element text or attribute
//
// script parameters passed as attributes
//      data-src-select, data-dst-select - css selector for source and destination node
//      data-src-attribute - the attribute name from source to watch for populating into destination node.
//                          if omitted the innerText of source node is used.
//      data-dst-attribute - attribute name of destination node which will be set on change of source node.
//                          if omitted the innerText of destination node is used.
    const scr = document.currentScript;

    const bind = (srcEl, srcAttr) => {
        const config = {
            attributes: !!srcAttr,
            childList: !srcAttr,
            subtree: !srcAttr
        };

        const update = txt => {
                [...document.querySelectorAll(scr.getAttribute('data-dst-select'))].map(dst => {
                    const attr = scr.getAttribute('data-dst-attribute');
                    attr ? dst.setAttribute(attr, txt) : dst.innerText = txt;
                });
            },
            callback = mutationsList => {
                for (let mutation of mutationsList) if (srcAttr) {
                    if (mutation.type === 'attributes' && mutation.attributeName === srcAttr) update(el.getAttribute(srcAttr));
                } else if (mutation.type === 'childList') update(el.innerText);
            };

        if ('value' === srcAttr) srcEl.addEventListener('input', function () {
            update(this.value);
        });
        const observer = new MutationObserver(callback);
        observer.observe(srcEl, config);
        return observer; // Later, you can stop observing by calling observer.disconnect();
    };

    [...document.querySelectorAll(scr.getAttribute('data-src-select'))].map(el => bind(el, scr.getAttribute('data-src-attribute')));;

    EPA_vars2globals = () => EPA_local.globals["scr"]=scr,EPA_local.globals["format"]=format,EPA_local.globals["bind"]=bind;
} finally {
    EPA_EndScope();

    if (true) {
        EPA_local._setReadyState("complete");

        EPA_local._emitEvent(EPA_local, "load");
    }
}
  