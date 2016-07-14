/*
 * BookmarkCommentViewer.js
 * Copyright (C) 2006, hatena ( http://www.hatena.ne.jp/ ).
 *
 * MIT Licence.
 *
 *
 * - 1.2 2006/09/21
 *   [change] don't use global namespaces function
 *
 * - 1.1 2006/09/21
 *   [change] JSONPCallback Name
 *   [change] initCreateRelAfterIcon a.href string delete b's http://~
 *
 * - 1.0 2006/09/19 
 *   release
 */

if (typeof(BookmarkCommentViewer) == 'undefined') {
    BookmarkCommentViewer = {};
}
BookmarkCommentViewer.NAME = "BookmarkCommentViewer";
BookmarkCommentViewer.VERSION = "1.2";
BookmarkCommentViewer.__repr__ = function () {
    return "[" + this.NAME + " " + this.VERSION + "]";
};
BookmarkCommentViewer.toString = function () {
    return this.__repr__();
};
BookmarkCommentViewer.JSONPCallbacks = {};

update(BookmarkCommentViewer, {
    JSONURL: 'http://b.hatena.ne.jp/entry/jsonlite/?url=',
    ICONURL: 'http://r.hatena.ne.jp/images/popup.gif',
    B_ENTRY_ICONURL: 'http://r.hatena.ne.jp/images/b_entry.gif',
    B_APPEND_ENTRY_ICONURL: 'http://r.hatena.ne.jp/images/b_add.gif',
    LOADING_ICONURL: 'http://r.hatena.ne.jp/images/load_s.gif',
    COMMENT_CACHE: {},
    B_IMG_LINK_CACHE: {},

    options: {
        dateFormat: '%y年%m月%d日',
        bUserIcon: true,
        tags: true,
        blankCommentHide : false,
        screenshot: false,
        commentWidth: 400,
        maxLimit: 200,
        maxLimitIE: 100,
        maxListHeight: 300,
        firstShowLimit: 20,
        sortReverse: false
    },

    createAafterIcon: function(a) {
        if (!(a && a.tagName == 'A')) return;
        var img = IMG({
            src: this.ICONURL,
            alt: a.href + 'のブックマークコメント',
            title: a.href + 'のブックマークコメント'
        });
        addElementClass(img, 'hatena-bcomment-view-icon');
        a.parentNode.insertBefore(img, a.nextSibling);

        MochiKit.Signal.connect(img, 'onclick', this, partial(this.iconImageClickHandler, img, a.href));
    },

    iconImageClickHandler: function(img, url, ev) {
        this.toggleCommentView(img, url);
        (ev.src ? ev : new MochiKit.Signal.Event(img, ev)).stop();
        return false;
    },

    toggleCommentView: function(el, url) {
        var comment = this.popupCommentView(el, url);
        this.toggleElementDisplay(comment);
    },

    toggleElementDisplay: function(el) {
        el.style.display == 'none' ? showElement(el)
                                   : hideElement(el);
    },

    popupCommentView: function(el, url) {
        this.popupInit(el);
        var cacheKey = [el, url];
        var comment = this.COMMENT_CACHE[cacheKey];
        if(!comment) {
            el.src = this.LOADING_ICONURL;
            var comment = this.asyncCommnetView(url, bind(function(div) {
                el.src = this.ICONURL;
                this.commentAreaMove(div, el);
            }, this));
            this.COMMENT_CACHE[cacheKey] = comment;
            document.body.appendChild(comment);
            //el.parentNode.insertBefore(comment, el.nextSibling);
        }
        return comment;
    },

    commentAreaMove: function(comment, el) {
        var pos = getElementPosition(el);
        if( getViewportDimensions().w - pos.x < this.options.commentWidth ) {
            pos.x = getViewportDimensions().w - this.options.commentWidth - 20;
        }
        pos.x = Math.max(pos.x - 20, 0);
        pos.y += 15;
        setElementPosition(comment, pos);
    },

    popupInit: function() {
        if (this._popupInitLoaded) return;
        this._popupInitLoaded = true;
        MochiKit.Signal.connect(this, 'allHideComment', this, function(ev) {
            forEach(items(this.COMMENT_CACHE), compose(hideElement, itemgetter(1)));
        });
        MochiKit.Signal.connect(document.body, 'onclick', this, function(ev) {
            MochiKit.Signal.signal(this, 'allHideComment');
        });
    },

    includeParentALink: function(el) {
        if (el.toString().indexOf('http') >= 0) {
            return true;
        }
        if(el.parentNode) {
            return this.includeParentALink(el.parentNode);
        }
        return false;
    },

    asyncCommnetView: function(url, onCompleteCallback) {
        if( typeof onCompleteCallback != 'function') {
            onCompleteCallback = function(){};
        }
        var self = this;
        var div = DIV({'class': 'hatena-bcomment-view'});
        div.style.width = this.options.commentWidth;
        MochiKit.Signal.connect(div, 'onclick', function(ev) {
            if(!self.includeParentALink(ev.target())) {
                ev.stop();
            }
        });

        var createView = partial(this.createView, url, onCompleteCallback, div);
        var d = sendJSONPRequest(
            this.JSONURL + encodeURIComponent(url), 'callback', null, {
                charset: 'utf-8'
        });
        d.addCallback(function(json) {
            createView(json);
        });
        d.addErrback(function(e) { 
            // log(e);
            createView('データの読み込みに失敗しました。', e);
        });
        return div;
    },

    createView: function(url, callback, div, json, error) {
        if(error) {
            appendChildNodes(div, this.createTitle(json, url));
        } else if(!json) {
            appendChildNodes(div, this.createTitle('まだブックマークされていません。', url));
        } else {
            var ul = UL();
            MochiKit.Signal.connect(ul, 'refreshPosition', partial(this.commentListRefreshPosition, ul, this.options.maxListHeight));
            if( this.options.screenshot ) {
                this.addScreenshot(ul, json.screenshot, json.title);
            }
            var liCreater = this.createBUserListFunction(json.eid);
            var bookmarks = json.bookmarks;
            if ( this.options.blankCommentHide ) {
                bookmarks = list(ifilter(function(bookmark) {
                    return bookmark.comment.replace(/\s+/g,'').length != 0
                }, bookmarks));
            }
            var bUserCount = bookmarks.length;
            if ( this.options.sortReverse ) {
                bookmarks = bookmarks.reverse();
            }
            if ( /MSIE/.test(navigator.userAgent) && this.options.maxLimitIE ) {
                var maxLimit = this.options.maxLimitIE;
            } else if ( this.options.maxLimit ) {
                var maxLimit = this.options.maxLimit;
            } else {
                var maxLimit = bUserCount;
            }
            appendChildNodes(div, this.createTitle(json.title, url));

            if (bUserCount > 0) {
                var self = this;
                
                var loopCount = Math.min(this.options.firstShowLimit, maxLimit, bUserCount);
                for (var i = 0; i < loopCount; i++) {
                    var ymd = self.getYMD(new Date(bookmarks[i].timestamp));
                    ul.appendChild(liCreater(bookmarks[i], ymd));
                }

                callLater(0, function() {
                    for (var i = loopCount; i < maxLimit; i++) {
                        var ymd = self.getYMD(new Date(bookmarks[i].timestamp));
                        ul.appendChild(liCreater(bookmarks[i], ymd));
                    }
                    if ( bUserCount > maxLimit ) {
                        appendChildNodes(ul, LI({'class': 'hatena-bcomment-view-moreread'}, self.createBEntryLink(url, '続きを読む', '#comments')));
                    }
                    MochiKit.Signal.signal(ul, 'refreshPosition');
                });
                appendChildNodes(div, ul);
            }
        }
        showElement(div);
        if ( ul ) MochiKit.Signal.signal(ul, 'refreshPosition');
        callback(div);
    },

    commentListRefreshPosition: function(ul, height) {
        if ( ul.offsetHeight > height) ul.style.height = height.toString() + 'px';
    },

    createTitle: function(title, url) {
        return P({'class': 'hatena-bcomment-title'}, title, this.createBEntryLinkWithUsers(url), this.createBAppendLink(url) );
    },

    createBEntryWithImage: function(url) {
        return this.createBEntryLink(url, IMG({
            src: this.B_ENTRY_ICONURL,
            alt: 'このエントリーを含むブックマーク',
            border: 0,
            title: 'このエントリーを含むブックマーク'
        }));
   },

    createBEntryLink: function(url, el, comment) {
        return A({
            href: 'http://b.hatena.ne.jp/entry/' + url.replace('#', '%23') + (comment ? comment : '')
        }, el);
    },

    createBEntryLinkWithUsers: function(url) {
        return this.createBEntryLink(url, IMG({
            src: 'http://b.hatena.ne.jp/entry/image/' + url.replace('#', '%23'),
            alt: 'このエントリーを含むブックマーク',
            border: 0,
            title: 'このエントリーを含むブックマーク'
        }));
    },

    createBAppendLink: function(url) {
        return A({
            href: 'http://b.hatena.ne.jp/append?' + encodeURIComponent(url)
        }, IMG({
            src: this.B_APPEND_ENTRY_ICONURL,
            alt: 'このエントリーをブックマークに追加する',
            border: 0,
            title: 'このエントリーをブックマークに追加する'
        }));
    },

    addScreenshot: function(ul, screenshot, title) {
        var sImg = IMG({
            src: screenshot,
            'class': 'hatena-bcomment-screenshot',
            style: 'float: right',
            alt: title + 'のスクリーンショット',
            title: title + 'のスクリーンショット'
        });
        sImg.style.margin = '10px';
        ul.appendChild(sImg);
    },

    siprintf: function(str, replaceStrings/* ... */) {
        var strs = extend(null, arguments, 1);
        var len = strs.length;
        for (var i = 0; i < len; i++)
            str = str.replace('%s', strs[i]);
        return str;
    },

    createBUserListFunction: function(eid) {
        var self = this;
        return function(bookmark, ymd) {
            var ary = [];
            var options = self.options;
            if ( options.dateFormat ) {
                ary.push(self.siprintf('<span class="hatena-bcomment-date">%s</span>',
                  escapeHTML(options.dateFormat.replace('%y', ymd[0]).replace('%m', ymd[1]).replace('%d', ymd[2]))
                ));
            }
            if( options.bUserIcon ) {
                ary.push(self.createBImageLink(bookmark.user));
            }
            ary.push(self.createBUserLink(bookmark.user, ymd, eid));
            if( options.tags ) {
                ary.push(self.createUserTagsLink(bookmark.user, bookmark.tags));
            }
            ary.push(escapeHTML(bookmark.comment));
            var li = LI();
            li.innerHTML = ary.join('');
            return li;
        };
    },

    createUserTagsLink: function(bUserName, tags) {
        var len = tags.length;
        var res = [];
        var tmpl = '<span class="hatena-bcomment-tag"><a href="%s">%s</a></span>';
        for (var i = 0; i < len; i++) {
            var tag = tags[i];
            res.push(this.siprintf(tmpl, 'http://b.hatena.ne.jp/' + bUserName + '/' + encodeURIComponent(tag), escapeHTML(tag)));
        };
        return res.join(', ');
    },

    createBUserLink: function(bUserName, ymd, eid) {
          return this.siprintf('<a href="%s">%s</a>',
                'http://b.hatena.ne.jp/' + bUserName + '/' + ymd.join('') + '#bookmark-' + eid,
                bUserName);
    },

    getYMD: function(date) {
        var ymd = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        ymd[1] = ymd[1].toString().length == 1 ? '0' + ymd[1] : ymd[1];
        ymd[2] = ymd[2].toString().length == 1 ? '0' + ymd[2] : ymd[2];
        return ymd;
    },

    createBImageLink: function(bUserName) {
        var bImg = this.B_IMG_LINK_CACHE[bUserName];
        if (!bImg) {
            bImg = this.siprintf('<a href="%s"><img height=16 width=16 border=0 src="%s" alt="%s" title="%s"></a>', 
              'http://b.hatena.ne.jp/' + bUserName + '/',
              'http://www.st-hatena.com/users/' + bUserName.substr(0, 2) + '/' + bUserName + '/profile_s.gif',
              bUserName,
              bUserName);
            this.B_IMG_LINK_CACHE[bUserName] = bImg;
        }
        return bImg;
    },

    initCreateRelAfterIcon: function() {
        var self = this;
        MochiKit.Signal.connect(window, 'onload', function() {
            forEach(document.getElementsByTagName('a'), function(a) {
                if( a.rel && a.rel == 'bcomment-viewer' ) {
                    a.href = a.href.replace(/^http:\/\/b.hatena.ne.jp\/entry\//, '');
                    self.createAafterIcon(a);
                }
            });
        });
    },

    updateOptions: function(options) {
        update(this.options, options);
    },

    EXPORT_TAGS: {
        ":all": ['iconImageClickHandler', 'initCreateRelAfterIcon']
    }
});

nameFunctions(BookmarkCommentViewer);
bindMethods(BookmarkCommentViewer);
MochiKit.Base._exportSymbols(window, BookmarkCommentViewer);
