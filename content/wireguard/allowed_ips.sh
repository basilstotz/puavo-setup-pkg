#!/bin/sh
if test $2 = 32; then
    echo $1/$2
else
    echo "$(ipcalc $1/$2|grep Network|xargs|cut -d" " -f2)"
fi

exit 0
