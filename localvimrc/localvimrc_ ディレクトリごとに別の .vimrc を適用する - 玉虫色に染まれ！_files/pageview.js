// Treasure Data Javascript SDK
!function(t,e){if(void 0===e[t]){e[t]=function(){e[t].clients.push(this),this._init=[Array.prototype.slice.call(arguments)]},e[t].clients=[];for(var r=function(t){return function(){return this["_"+t]=this["_"+t]||[],this["_"+t].push(Array.prototype.slice.call(arguments)),this}},n=["addRecord","set","trackEvent","trackPageview","ready"],s=0;s<n.length;s++){var i=n[s];e[t].prototype[i]=r(i)}var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=("https:"===document.location.protocol?"https:":"http:")+"//cdn.treasuredata.com/sdk/td-1.5.1.js";var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)}}("Treasure",this);
// Treasure Data Javascript SDK

var _audiencedata_ = function() {
    var g = {},
        scripts = document.getElementsByTagName('script');

    // script要素を下からサーチ
    for (var i = scripts.length - 1; i >= 0 ; i--) {
        var src = scripts[i].src;
        // 要素にIDNタグを含むとき
        if ( ~src.indexOf('cdn.audiencedata.net/js/v1/pageview.js') ) {
            var query = src.substring(src.indexOf('?') + 1),
                parameters = query.split('&'),
                result = {};
                // URLクエリを分解して取得する
            for (var j = 0, len = parameters.length; j < len; j++) {
                var element = parameters[j].split('='),
                    paramName = decodeURIComponent(element[0]),
                    paramValue = decodeURIComponent(element[1]);
                result[paramName] = paramValue;
            }
            break;
        }
    }

    g.owner_id = result['owner_id'] || "test";
    g.site_id = result['site_id'] || "-";

    g.ld = function(url) {
        var e = document.createElement('script');
        e.type = 'text/javascript';
        e.async = true;
        e.src = url;
        scripts[0].parentNode.insertBefore(e, scripts[0]);
    };

    g.pv = function(p) {
        g.imid = p.imid || "-";

        var ids = {
            imid: g.imid,
            owner_id: g.owner_id,
            site_id: g.site_id
        };

        if (typeof(Treasure) !== "undefined") {
            var td = new Treasure({
                host: 'in.treasuredata.com',
                writeKey: '7959/136a1681b6cd956766a473a7da9554e0caf1923e',
                database: "audiencedata_production"
            });
            td.set('pageviews', ids);
            td.trackPageview('pageviews');
        };
    };

    g.ld('//sync.im-apps.net/imid/get?callback=_audiencedata_.pv');
    return g;
}();

