if (typeof Hatena       == 'undefined') Hatena = {};
if (typeof Hatena.Diary == 'undefined') Hatena.Diary = {};

Hatena.Diary.TwitterEntryIcon = new Ten.Class({
    initialize : function (icon) {
        this.icon = icon;
        new Ten.Observer(this.icon, 'onclick', this, 'redirect');
    }
}, {
    redirect : function (event) {
        event.stop();
        var self = this;
        new Ten.XHR(
            '/api/shortenurl?text=' + self.icon.href.replace(/http:\/\/twitter\.com\/home\/\?status=/, ''), {
                method: 'GET',
                data  : {}
            }, function (res) {
                var json = eval("(" + res.responseText + ")");
                location.href = 'http://twitter.com/home/?status=' + json.result;
            }
        );
    }
});

Ten.DOM.addEventListener('DOMContentLoaded', function() {
    var twitter_entry_icons = Ten.DOM.getElementsByTagAndClassName('a', 'twitter-entry-icon');
    if (!twitter_entry_icons) return;
    for (var i = 0; i < twitter_entry_icons.length; i++) {
        new Hatena.Diary.TwitterEntryIcon(twitter_entry_icons[i]);
    }
});
