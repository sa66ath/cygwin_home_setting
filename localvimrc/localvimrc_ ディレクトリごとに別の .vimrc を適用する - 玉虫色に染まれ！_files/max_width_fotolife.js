(function() {
    function setFotolifeImagesMaxWidth() {
        if (!Ten.Browser.isIE)
            return;

        var mainColumn = Ten.DOM.getElementsByTagAndClassName('h3','title')[0];
        if (!mainColumn)
            return;

        var mainColumnWidth = mainColumn.offsetWidth - 50;

        if (Ten.Browser.version >= 7) {
            var images = document.images;
            for (var i = 0; i < images.length; i++) {
                var fotoWidth = Ten.Style.getElementStyle(images[i], 'maxWidth');
                var maxWidth = parseFloat(fotoWidth);
                if (fotoWidth.match('%$'))
                    maxWidth = mainColumnWidth;
                if (maxWidth > 200 && images[i].width > maxWidth) {
                    images[i].width = maxWidth;
                }
            }
        } else {
            function applyMaxWidth(selector) {
                var fotowidth = Ten.Style.getGlobalStyle(selector, 'max-width');
                var maxWidth = parseFloat(fotowidth);
                if (fotowidth.match('%$'))
                    maxWidth = mainColumnWidth;
                var images = Ten.Selector.getElementsBySelector(selector);
                for (var i = 0; i < images.length; i++) {
                    if (maxWidth > 200 && images[i].width > maxWidth)
                    images[i].width = maxWidth;
                }
            }
            applyMaxWidth('div.section img.hatena-fotolife');
            applyMaxWidth('div.main div.section img.hatena-fotolife');
        }
    }
    new Ten.Observer(
        window,
        'onload',
        [setFotolifeImagesMaxWidth],
        '0'
    );
})();

/*
(function() {
    function getWidth(imgElement) {
        var image = new Image();
        image.src = imgElement.src;
        return image.width;
    }

    function setFotolifeImagesMaxWidth() {
        if (!Ten.Browser.isIE)
            return;
        if (Ten.Browser.version >= 7) {
            var images = document.images;
            for (var i = 0; i < images.length; i++) {
                var maxWidth = parseFloat(Ten.Style.getElementStyle(images[i], 'maxWidth'));
                if (getWidth(images[i]) > maxWidth)
                    images[i].width = maxWidth;
            }
        } else {
            function applyMaxWidth(selector) {
                var maxWidth = parseFloat(Ten.Style.getGlobalStyle(selector, 'max-width'));
                var images = Ten.Selector.getElementsBySelector(selector);
                for (var i = 0; i < images.length; i++) {
                    if (getWidth(images[i]) > maxWidth)
                    images[i].width = maxWidth;
                }
            }
            applyMaxWidth('div.section img.hatena-fotolife');
            applyMaxWidth('div.main div.section img.hatena-fotolife');
        }
    }
    Ten.DOM.addEventListener(
        'DOMContentLoaded',
        setFotolifeImagesMaxWidth
    );
})();
*/
