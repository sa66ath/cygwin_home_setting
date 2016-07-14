" set enc=utf-8
" set fenc=utf-8
set fencs=utf-8,iso-2022-jp,sjis,euc-jp
" syntax on
let loaded_matchparen = 1
"
"
if has("autocmd")
	filetype plugin indent on
endif

"===============================================================
" Mode-dependent cursor in vim
let &t_ti.="\e[1 q"
let &t_SI.="\e[5 q"
let &t_EI.="\e[1 q"
let &t_te.="\e[0 q"



"===============================================================
" set number         " 行番号を表示する
" set cursorline     " カーソル行の背景色を変える
" set cursorcolumn   " カーソル位置のカラムの背景色を変える
" set laststatus=2   " ステータス行を常に表示
" set cmdheight=2    " メッセージ表示欄を2行確保
" set showmatch      " 対応する括弧を強調表示
" set helpheight=999 " ヘルプを画面いっぱいに開く
" set list           " 不可視文字を表示
" 不可視文字の表示記号指定
" set listchars=tab:▸\ ,eol:↲,extends:❯,precedes:❮


"===============================================================
" let g:localvimrc_ask=0        " いちいち聞かずに勝手に読み込む
" let g:localvimrc_persistent=2 " 一度聞いたファイルを記録しておき、次回からは自動で読み込む
let g:localvimrc_persistent=1 " 聞いたときに大文字のY/N/Aで答えた場合のみ上記の動作をする
