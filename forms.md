# Forms handling by embed-page

## On click
 
1. for A or FORM dom tree ancestor 
    * target set to embed-page IFRAME name
    * blank form.action set to this.src 
    * other action is kept intact to preserve the actual submit into IFRAME     
2. browser submits(get/post) into IFRAME  
3. IFRAME onload handler (on before load TBD)
    this.src = frame.src 
    * which triggers content load
 