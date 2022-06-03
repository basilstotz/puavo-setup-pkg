#!/bin/sh

cd $(dirname $0)

cp ./puavo-webfilter /usr/local/sbin/.


cat <<EOF > /etc/systemd/system/puavo-webfilter.service
[Unit]
Description=Puavo Web-Filter 
#After=syslog.target network.target nss-lookup.target

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/puavo-webfilter


[Install]
WantedBy=multi-user.target
EOF

systemctl enable puavo-webfilter.service





