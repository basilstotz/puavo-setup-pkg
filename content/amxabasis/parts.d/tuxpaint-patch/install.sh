#!/bin/sh

cd $(dirname $0)

cp ./profile.d/*.sh /etc/profile.d/.
cp ./tuxpaint.desktop /usr/share/applications/.


