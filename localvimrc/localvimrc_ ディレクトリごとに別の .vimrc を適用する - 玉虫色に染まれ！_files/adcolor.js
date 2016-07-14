(function(){
    function getCurrentScript(){
	return (
		function (e) {
	    if( !e ) return;
	    if(e.nodeName.toLowerCase() == 'script') return e;
	    return arguments.callee(e.lastChild);
	})(document);
    }
    var original_document_write = document.write;
    document._write = document.write;
    document.write = function(){
	var current = getCurrentScript();
	if( current && current.src.match( /pagead2[.]googlesyndication[.]com/ && current.parentNode && current.parentNode.className == 'ad' && Ten ) ){
	    var tag = arguments[0];
	    if( tag.match( /color_border/ ) ){
		var sel = ['color_border','color_bg','color_link','color_url','color_text'];
		var l = sel.length;
		for( var i=0; i<l; i++ ){
		    var prop = Ten.Style.getGlobalStyle('.google_'+sel[i],'color');
		    if( prop ){
			var color = Ten.Color.parseFromString(prop);
			if( color ){
			    var hexcolor = color.asHexString().slice(1);
			    var re = new RegExp(sel[i]+'=[0-9a-fA-F]+');
			    var rep = sel[i]+'='+hexcolor;
			    tag = tag.replace( re, rep );
			}
		    }
		}
		arguments[0] = tag;
	    }
	}
	try{
	    //original_document_write.apply(document, arguments);
        var args = Array.prototype.slice.call(arguments);
        original_document_write.call(document, args.join(""));
	} catch(e){
	    var args = Array.prototype.slice.call(arguments);
	    try {
		original_document_write(args.join(""));
	    } catch(e){
		document._write(args.join(""));
	    }
	}
    };
})();
