#!/bin/sh
test -h /usr/bin/chromium-browser || ln -s /usr/bin/chromium /usr/bin/chromium-browser
exit
