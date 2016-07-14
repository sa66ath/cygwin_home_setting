// require Ten.js

// 似たようなクラスが既にありそう
FormVerifier = new Ten.Class({
    initialize: function(form, button) {
        if (!form)
            return;

        this.form = form;
        this.button = button;
        this.verifiers = [];
        this.clicked = false;
        this.button = button;
        new Ten.Observer(this.form, 'onsubmit', this, 'onSubmit');
        new Ten.Observer(this.button, 'onclick', this, 'onClick');
    }
},{
    addVerifier: function(verify) {
        if (typeof verify != 'function')
            return;

        this.verifiers.push(verify);
    },
    onSubmit: function(e) {
         if (!this.clicked)
             return;
        this.clicked = false;
        var valid = true;
        for (var i=0; i < this.verifiers.length; ++i) {
            var v = this.verifiers[i];
            if (!v())
                valid = false;
        }
        if (!valid)
            e.stop();
    },
    onClick: function(e) {
        this.clicked = true;
    }
});

TextInputDescription = new Ten.Class({
    initialize: function(textInput, form, text) {
        if (!textInput || !form) return;

        this.textInput = textInput;
        this.form = form;
        this.defaultText = text;

        new Ten.Observer(this.textInput, 'onfocus', this, 'onFocus');
        new Ten.Observer(this.textInput, 'onblur', this, 'onBlur');

        if (!this.textInput.value) {
            this.showDescription();
        }
    }
},{
    onFocus: function() {
        if (this.textInput.value == this.defaultText) {
            this.hideDescription();
        }
    },

    onBlur: function() {
        if (!this.textInput.value) {
            this.showDescription();
        }
    },

    isDefault: function(e) {
        return this.textInput.value == this.defaultText;
    },

    showDescription: function() {
        this.textInput.value = this.defaultText;
        this.textInput.style.color = '#AAAAAA';
    },

    hideDescription: function() {
        this.textInput.value = '';
        this.textInput.style.color = '';
    }
});

// 分離したのでこれはいらない、と
// TextInputDescriptionOption = new Ten.Class({
//     initialize: function(textInput, form, text) {
//         if (!textInput || !form) return;

//         this.textInput = textInput;
//         this.form = form;
//         this.defaultText = text;

//         new Ten.Observer(this.textInput, 'onfocus', this, 'onFocus');
//         new Ten.Observer(this.textInput, 'onblur', this, 'onBlur');

//         if (!this.textInput.value) {
//             this.showDescription();
//         }
//     }
// },{
//     onFocus: function() {
//         if (this.textInput.value == this.defaultText) {
//             this.hideDescription();
//         }
//     },

//     onBlur: function() {
//         if (!this.textInput.value) {
//             this.showDescription();
//         }
//     },

//     showDescription: function() {
//         this.textInput.value = this.defaultText;
//         this.textInput.style.color = '#AAAAAA';
//     },

//     hideDescription: function() {
//         this.textInput.value = '';
//         this.textInput.style.color = '';
//     }
// });

function embedWmvPlayer(container, url) {
    var width = 320;
    var height = 240;
    var showControls = true;
    var showStatus = true;
    var autoStart = true;

    if (container.innerHTML) return;

    if (showControls) {
        height += 45;
    }
    if (showStatus) {
        height += 24;
    }
    container.style.background = "";
    container.style.backgroundColor = "#000000";
    container.style.border = "";
    container.innerHTML = [

"<object",
" width='", width, "'",
" height='", height, "'",
" classid='CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95'",
" codebase='http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=6,4,5,715'",
" type='application/x-oleobject'>",
"<param name='FileName' value='", url, "'>",
"<param name='ShowControls' value='", ((showControls)?"TRUE":"FALSE"), "'>",
"<param name='AutoStart' value='", ((autoStart)?"TRUE":"FALSE"), "'>",
"<param name='ShowStatusBar' value='", ((showStatus)?"TRUE":"FALSE"), "'>",
"<param name='StretchToFit' value='TRUE'>",
"<embed type='application/x-mplayer2'",
" pluginspage='http://www.microsoft.com/Windows/MediaPlayer/'",
" src='", url, "'",
" width='", width, "'",
" height='", height, "'",
" showcontrols='", ((showControls)?"1":"0"), "'",
" autostart='", ((autoStart)?"1":"0"), "'",
" stretchToFit='1'",
" showstatusbar='", ((showStatus)?"1":"0"), "'>",
"</embed>",
"</object>"

    ].join('');
}

function embedQuicktimePlayer(container, url) {
    var width = 320;
    var height = 240;
    var showControls = true;
    var autoStart = true;
    var bgcolor = "#000000";

    if (container.innerHTML) return;

    if (showControls) {
        height += 16;
    }
    container.style.background = "";
    container.style.backgroundColor = "#000000";
    container.style.border = "";
    container.innerHTML = [

"<OBJECT",
" name='QT'",
" classid='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B'",
" width='", width, "'",
" height='", height, "'",
" codebase='http://www.apple.com/qtactivex/qtplugin.cab'>",
"<param name='SRC' value='", url, "'>",
"<param name='QTSRC' value='", url, "'>",
"<param name='CONTROLLER' value='", ((showControls)?"TRUE":"FALSE"), "'>",
"<param name='AUTOPLAY' value='", ((autoStart)?"TRUE":"FALSE"), "'>",
"<param name='BGCOLOR' value='", bgcolor, "'>",
"<param name='SCALE' value='ASPECT'>",
"<EMBED",
" name='QT'",
" pluginspage='http://www.apple.co.jp/quicktime/download/'",
" type='video/quicktime'",
" src='", url, "'",
" qtsrc='", url, "'",
" width='", width, "' height='", height, "'",
" controller='", ((showControls)?"true":"false"), "'",
" autoplay='", ((autoStart)?"true":"false"), "'",
" bgcolor='", bgcolor, "'",
" scale='aspect'>",
"</EMBED>",
"</OBJECT>"

    ].join('');
}

