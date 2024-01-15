#!/bin/sh
set -ex
configs="
window.env = {
  VEDA_SERVER_DOMAIN: '$VEDA_SERVER_DOMAIN',
  isProd: '$isProd',
};
"
# decide the config file path
file="/usr/share/nginx/html/config.js"
echo $configs > $file
echo -e "\e[1;32m$configs"

echo "++++++++++++++++++++++++++++++++++++++++++++"
echo "file=$file"
echo "++++++++++++++++++++++++++++++++++++++++++++"
# echo "VITE_VEDA_SERVER_DOMAIN=$VITE_VEDA_SERVER_DOMAIN" > /usr/share/nginx/html/.env