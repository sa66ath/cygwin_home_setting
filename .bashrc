#
# For Japanese
#
# export LANG=ja_JP.SJIS
# export LANG=ja_JP.UTF-8
# export TZ=JST-9
# export JLESSCHARSET=japanese-sjis
#export JLESSCHARSET=utf-8
#export LESSCHARSET=utf-8
#export LESSCHARSET=dos
export SVN_EDITOR=vi
#
# Add . on head of PATH
#
# PATH=./:${PATH}
# PATH=./:~/bin:${PATH}
PATH=./:~/bin:${PATH}:'/cygdrive/c/Program Files/vsthostx64/'

alias ls='ls --show-control-chars -F'
alias vsthost='/cygdrive/c/Program\ Files/vsthostx64/vsthost'
alias vi='vim'

# Prompt
#       Color Escape Sequence
#       \[\e[**m\]:
#               ** = 30 = Black, 31 = Red, 32 = Green, 33 = Yellow,
#               34 = Blue, 35 = Purple, 36 = Light Blue, 37 = White
#
# PS1='\n\[\e[34m\]\u@Cygwin-\h : \w\n\$\[\e[0m\] '

#
# for cproto of MPLABX XC Compiler 
#
export XC8_INCLUDE="/cygdrive/c/Program\ Files\ \(x86\)/Microchip/xc8/v1.33/include/"
export XC16_INCLUDE="/cygdrive/c/Program\ Files\ \(x86\)/Microchip/xc16/v1.23/include/"
export XC32_INCLUDE="/cygdrive/c/Program\ Files\ \(x86\)/Microchip/xc16/v1.34/include/"
