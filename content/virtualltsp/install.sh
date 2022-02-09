#!/bin/sh

cd $(dirname $0)

cp ./tree/etc/avahi/avahi-daemon.conf /etc/avahi/avahi-daemon.conf
cp ./tree/etc/systemd/system/puavo-virtualltsp-setup.service /etc/systemd/system/puavo-virtualltsp-setup.service
cp ./tree/etc/systemd/system/puavo-virtualltsp-daemon.service /etc/systemd/system/puavo-virtualltsp-daemon.service

cp ./tree/usr/local/bin/puavo-find-puavobox /usr/local/bin/puavo-find-puavobox 

cp ./tree/usr/local/sbin/puavo-virtualltsp-client /usr/local/sbin/puavo-virtualltsp-client
cp ./tree/usr/local/sbin/puavo-virtualltsp-daemon /usr/local/sbin/puavo-virtualltsp-daemon
cp ./tree/usr/local/sbin/puavo-virtualltsp-setup /usr/local/sbin/puavo-virtualltsp-setup

systemctl enable puavo-virtualltsp-setup.service

exit 0
