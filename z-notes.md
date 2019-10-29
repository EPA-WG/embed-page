# temp notes on dev process
Have a sense along with commits. Content would be cleared on commit following 
the annotated here commit. 
# build process
## Goal
* `esm-unbundled` build with demo files. 
* `esm-bundled/embed-page.js` bundled with Polymer for 1-file embedding into page. 

## esm-bundled
    89Kb - too much
        50Kb - src
        40Kb - compiled( unbundled )
way to reduce:
* remove PolymerElement as parent
* remove comments
* ? replace regex-ex with parsing algorithms 
    
