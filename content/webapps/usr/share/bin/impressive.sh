#!/bin/sh
if test -n "$1"; then
   FILE="$1"
else
   FILE="$(zenity --file-selection)"
fi
impressive "$FILE"
exit
