#!/bin/sh

cd $(dirname $0)

cp ./puavo-safesearch /usr/local/sbin/.


cat <<EOF > /etc/systemd/system/puavo-safesearch.service
[Unit]
Description=Puavo Safesearch 
#After=syslog.target network.target nss-lookup.target

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/puavo-safesearch


[Install]
WantedBy=multi-user.target
EOF

systemctl enable puavo-safesearch.service





