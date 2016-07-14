// Needs Ten.js
new Ten.Observer(
    window,
    'onload', 
    function(){
        var form      = document.getElementById('comment-form');
        var submit_button = document.getElementById('comment-form-button');
        var message_p = Ten.DOM.getElementsByTagAndClassName('p', 'message', form)[0];
        // 応急処置。hatena2-white.css で p.message { padding: 1em }
        // でメッセージの上が微妙に開いてしまうので
        message_p.style.padding = '3px';

        // エラーメッセージが既にあればそこに飛ぶ
        // firefox では動いたが、これでいくなら他でもテストしないと
        if (message_p.hasChildNodes()) {
            document.location.href = '#error-message';
        }

        
        // On submitTextInputDescription
        function tid_verifier(tid, str) {
            var is_inserted = false;
            var text = document.createTextNode(str);
            var br   = document.createElement('br');
            
            // Verifier
            return function() {             
                if (tid.isDefault()) {
                    if (!is_inserted) {
                        message_p.appendChild(text);
                        message_p.appendChild(br);
                        message_p.style.display = 'block';          
                        is_inserted = true;
                    }
                    return false;
                }
                else {
                    if (is_inserted) {
                        message_p.removeChild(text);
                        message_p.removeChild(br);
                        if (!message_p.hasChildNodes())
                            message_p.style.display = 'none';
                        is_inserted = false;
                    }
                    return true;
                }
            };
        }
        
        var fv = new FormVerifier(form,submit_button);
        var e;
        
        e = document.getElementById('comment-textarea');
        if (e) 
            fv.addVerifier(tid_verifier(new TextInputDescription(e, form, ''), 'コメントを入力して下さい。'));
        e = document.getElementById('comment-username');
        if (e) 
            fv.addVerifier(tid_verifier(new TextInputDescription(e, form, 'なまえ'), '名前を入力して下さい。'));
        e = document.getElementById('comment-usermail');
        if (e)
            new TextInputDescription(e, form, 'メール(非公開)');
        e = document.getElementById('comment-userurl');
        if (e)
            new TextInputDescription(e, form, 'URL');
        e = document.getElementById('comment-captcha');
        if (e)
            fv.addVerifier(tid_verifier(new TextInputDescription(e, form, '画像内の文字列を入力して下さい'), '画像の文字列を入力してください'));
});


