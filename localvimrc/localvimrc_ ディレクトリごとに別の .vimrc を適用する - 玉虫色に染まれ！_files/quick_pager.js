if (typeof Hatena == 'undefined')
    Hatena = { };
if (typeof Hatena.Diary == 'undefined')
    Hatena.Diary = { };

Hatena.Diary.QuickPager = new Ten.Class({
    initialize: function () {
        this.addButton();
    },
    ImgSrcButtonUp: '/images/icon-quickpager.gif',
    ImgSrcButtonDown: '/images/icon-quickpager-on.gif',
    style: { verticalAlign: 'middle', marginLeft: '3px', cursor: 'pointer'}
}, {
    getPager: function () { throw 'override this method' },
    createNextContentURI: function () { throw 'override this method' },
    createNextPagerURI:   function () { throw 'override this method' },
    getAddButtonTarget: function () { throw 'override this method' },
    addButton: function () {
        this.target = this.target || this.getPager();
        if(!this.target) return;
        this.button = document.createElement('img');
        Ten.Style.applyStyle(this.button, this.constructor.style)
        this.button.src = this.constructor.ImgSrcButtonUp;
        new Ten.Observer(this.button, 'onclick', this, 'loadContent');
        var targetanchor = this.getAddButtonTarget();
        if(!targetanchor) return;
        Ten.DOM.insertAfter(this.button, targetanchor);
    },
    loadContent: function () {
        if (this.busy) return;
        this.buttonDown();
        var path = this.createNextContentURI();
        new Ten.XHR(path, { }, this, 'insertContent');
    },
    insertContent: function (xhr) {
        var path = this.createNextPagerURI();
        var days = document.getElementById('days');
        var div  = document.createElement('div');
        days.appendChild(div);
        div.innerHTML = xhr.responseText;
        /*
        for(var i=0; i < div.childNodes.length; i++) {
            days.appendChild(div.childNodes[i].cloneNode(true));
        }
        days.removeChild(div);
        */
        if(Hatena.Star)
            Hatena.Star.EntryLoader.loadNewEntries(div);
        if(Hatena.Diary.Section)
            Hatena.Diary.Section.loadAll(div);
        if(window.HBBlogParts)
            HBBlogParts.start();
        new Ten.XHR(path, { }, this, 'insertPager');
    },
    insertPager: function (xhr) {
        this.buttonUp();
        this.target.innerHTML = xhr.responseText;
        this.scrollDown();
        this.addButton();
    },
    buttonDown: function () {
        this.button.src = this.constructor.ImgSrcButtonDown;
        this.busy = true;
    },
    buttonUp: function () {
        this.button.src = this.constructor.ImgSrcButtonUp;
        this.busy = false;
    },
    scrollDown: function () {
          var scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
          var scrollX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
          if (scrollY + Ten.Geometry.getWindowSize().h < document.body.scrollHeight) 
              scrollTo(scrollX, scrollY + 100);
    }
});

Hatena.Diary.Calendar = new Ten.Class({
    base: [Hatena.Diary.QuickPager],
    initialize: function () {
        return this.constructor.SUPER.call(this);
    }
},{
    getPager: function () {
        var day = document.getElementById('days').nextSibling;
        if (!day) return false;
        do {
            if (day.className == 'calendar')
                return day;
        } while (day = day.nextSibling);
        return false;
    },
    getAddButtonTarget: function () {
        var anchor =  this.target.getElementsByTagName('a')[0];
        if(anchor && anchor.rel == 'prev') return anchor;
    },
    createNextContentURI: function () { 
        return this.getPath() + 'mode=days';
    },
    createNextPagerURI: function () {
        return this.getPath() + 'mode=pager';
    },
    getPath: function () {
        var url = this.target.getElementsByTagName("a")[0].href;
        if (url.match(/^\w+:/)) {
            if (url.split('/')[2] != location.host) {
                throw "host differs: " + url.split('/')[2];
            }
        }
        return url + (url.indexOf('?') > 0 ? '&' : '?');
    }
});

new Ten.Observer(window, 'onload', function() {
    new Hatena.Diary.Calendar();
});

Hatena.Diary.QuickSeeMore = new Ten.Class({
    initialize: function (obj) {
        this.loading = false;
        this.obj = obj;
        this.clickevent = new Ten.Observer(obj, 'onclick', this, 'click');
    },
    addHandler: function () {
        this.targetList = Ten.DOM.getElementsByTagAndClassName('p', 'seemore');
        for(var i=0; i<this.targetList.length; i++) {
            var a = this.targetList[i].getElementsByTagName('a')[0];
            if(a && a.hash && a.hash != '#seeall') {
                new Hatena.Diary.QuickSeeMore(a);
            }
        }
    }
},{
    click: function (e) {
        if(e && e.stop) e.stop();
        if(!this.loading) {
            this.href = e.target.href;
            href = this.href.replace(/#seemore/, '').replace(/#/, '/');
            href += '?mode=days';
            new Ten.XHR(href , { }, this, 'insertContent');
            this.loading = Ten.Element('span', {style:{fontSize: 'small'}}, ' (読み込み中…)');
            Ten.DOM.insertAfter(this.loading, this.obj);
        }
    },
    insertContent: function (xhr) {
        if(xhr.status == 200) {
            if(/<script(.|\s)*?\/script>/.test(xhr.responseText)) {
                location.href = this.href;
                return;
            }
            var div = Ten.Element('div');
            div.innerHTML = xhr.responseText;
            var footnote = Ten.DOM.getElementsByTagAndClassName('p', 'footnote', div);
            if(footnote.length > 0) {
                location.href = this.href;
                return;
            }
            var section = Ten.DOM.getElementsByTagAndClassName('div', 'section', div)[0];
            if(section) {
                if(Hatena.Star)
                    Hatena.Star.EntryLoader.loadNewEntries(div);
                if(Hatena.Diary.Section)
                    Hatena.Diary.Section.loadAll(div);
                var section_org = this.obj;
                while (section_org = section_org.parentNode) {
                    if(section_org.tagName == 'DIV' && section_org.className == 'section')
                        break;
                }
                Ten.DOM.replaceNode(section, section_org);
            }
        }
    }
});

Ten.DOM.addEventListener('DOMContentLoaded', Hatena.Diary.QuickSeeMore.addHandler);
