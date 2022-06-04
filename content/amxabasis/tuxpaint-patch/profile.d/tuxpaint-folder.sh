if  test -d $HOME/.tuxpaint/saved/; then
    if test -d $HOME/Bilder/;then
        if ! test -L $HOME/Bilder/TuxPaint/; then
	   ln -s $HOME/.tuxpaint/saved/ $HOME/Bilder/TuxPaint
        fi
    else
        if ! test -L $HOME/TuxPaint/; then
	   ln -s $HOME/.tuxpaint/saved/ $HOME/TuxPaint
        fi
    fi
fi
