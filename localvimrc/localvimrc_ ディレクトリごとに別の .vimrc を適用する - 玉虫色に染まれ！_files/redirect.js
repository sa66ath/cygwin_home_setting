(function (undef) {
    'use strict';
    if (window.top === window.self && !window._fout_queue.redirect['loaded']) {
        window._fout_queue.redirect['loaded'] = true;
        var redirectUrl = "//sync.fout.jp/sync",
            setCookie = function (key, value, expire) {
                var d = new Date();
                d.setDate(d.getDate() + expire);
                value = escape(value) + (null === expire ? "" : "; expires=" + d.toUTCString());
                document.cookie = key + "=" + value;
            },
            getCookie = function (key) {
                var counter, _key, _val, cookies = document.cookie.split(";");
                for (counter = 0; counter < cookies.length; counter++) {
                    if (_key = cookies[counter].substr(0, cookies[counter].indexOf("=")),
                        _val = cookies[counter].substr(cookies[counter].indexOf("=") + 1),
                        _key = _key.replace(/^\s+|\s+$/g, ""),
                        _key === key) return unescape(_val);
                }
            },
            buildURL = function (link, protocol) {
                var queue = _fout_queue.segment.queue;
                var user_id = queue[0].user_id;
                for (var i = 1; i < queue.length; i++) {
                    if (queue[i].user_id) {
                        user_id = user_id + "," + queue[i].user_id;
                    }
                }
                return protocol + redirectUrl + "?" + "type=redirect&user_id=" + user_id + "&rd=" +
                    encodeURIComponent(btoa(unescape(encodeURIComponent(link))));
            },
            traverseParent = function (target) {
                return "a" === target.localName ?
                    target : target.parentElement ?
                      traverseParent(target.parentElement) : null;
            },
            attachEvent = function () {
                window.addEventListener("click", function (e) {
                    if (!e.cancelBubble && !e.defaultPrevented) {
                        var anchor = traverseParent(e.target);
                        if (anchor) {
                            var link = anchor.toString();
                            if (/^https?:/.test(link) && -1 ===
                                link.indexOf("#")) {
                                    setCookie("_fout_redirect", "1", 365);
                                    var redirect = buildURL(link, anchor.protocol);
                                    anchor.href = redirect;
                                    setTimeout(function () {
                                        anchor.href = link;
                                    }, 0);

                            }
                        }
                    }
                }, !1);
            },
            main = function () {
                var uagent = navigator.userAgent.toLowerCase();
                if (!getCookie("_fout_redirect") &&
                    /safari/.test(uagent) && !/chrome/.test(uagent) && !/crios/.test(uagent)) {
                    attachEvent();
                }
            };
 
        main();
    }
})();
