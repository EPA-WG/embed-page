import {LooseParser} from "acorn-loose";
export default function parse( code ) /** throws SyntaxError exception */
{
    const ret = { imports:[], vars:[], consts:[], lets:[], funcs: [] };
    const ast = LooseParser.parse( code, {sourceType:"module"} );
    ast.body.forEach( n=>
    {
        switch( n.type )
        {
            case "ImportDeclaration":   // ret.imports.push( n.source.value );
                break;
            case "FunctionDeclaration":
                    ret.funcs.push( n.id.name );
                break;
            case "VariableDeclaration":
                n.declarations.forEach( d=>
                {
                    ({  Identifier     : x=> ret[ n.kind+'s'].push(d.id.name)
                    ,   ObjectPattern  : x=> d.id.properties.forEach( e=> ret[ n.kind+'s'].push( e.value.name ) )
                    ,   ArrayPattern   : x=> d.id.elements  .forEach( e=> ret[ n.kind+'s'].push( e.name ) )
                    })[ d.id.type ]()
                });
                break;
        }
    });
    return ret;
}
/* goal
    * replace imports & apply URL mapping - for now by regEx
    * find var, const, let, function
    * find undeclared vars assignment, including internal in function( need to track local vars to find undeclared )
 */