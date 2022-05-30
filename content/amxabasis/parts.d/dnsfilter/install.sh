#!/bin/sh

cd $(dirname $0)

cp ./puavo-dnsfilter /usr/local/sbin/.


cat <<EOF > /etc/systemd/system/puavo-dnsfilter.service
[Unit]
Description=Puavo DNS-Filter 
#After=syslog.target network.target nss-lookup.target

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/puavo-dnsfilter


[Install]
WantedBy=multi-user.target
EOF

systemctl enable puavo-dnsfilter.service





