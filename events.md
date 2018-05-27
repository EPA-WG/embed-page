# storage
The `storage` event is propagated as usual window event in a context `<embed-page>` with common scope. 
Depend of **scope** attribute  either **src** URL or **name** value is used to define `<embed-page>` common 
scope instances.
  
Each `<embed-page>` instance listens for `storage` window event. 
If event **key** matches the own prefix (made out of name, uid, or URL depend of **scope** )
, the event is dispatched by own EpaWindow instance triggering the listeners within `<embed-page>` context.
