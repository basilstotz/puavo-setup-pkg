if test "$UID" > 990; then

    NPM_PACKAGES="$HOME/.node_modules"
    if ! test -f $HOME/.npmrc ; then
	mkdir -p "$NPM_PACKAGES/bin"
	echo "prefix = $NPM_PACKAGES" > $HOME/.npmrc
    fi
    if test -d $NPM_PACKAGES/bin; then
        PATH="$NPM_PACKAGES/bin:$PATH"
    fi
 
fi
