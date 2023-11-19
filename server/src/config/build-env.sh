#!/bin/sh
set -ex

echo "DATABASE_URL=$DATABASE_URL" > /app/.env \
&& echo "SERVER_PORT=$SERVER_PORT" >> /app/.env \
&& echo "VEDA_FRONTEND_DOMAIN=$VEDA_FRONTEND_DOMAIN" >> /app/.env \
&& echo "DATABASE_NAME=$DATABASE_NAME" >> /app/.env \
&& echo "DATABASE_HOST=$DATABASE_HOST" >> /app/.env \
&& echo "DATABASE_USER=$DATABASE_USER" >> /app/.env \
&& echo "DATABASE_PASSWORD=$DATABASE_PASSWORD" >> /app/.env \
&& echo "DATABASE_PORT=$DATABASE_PORT" >> /app/.env \
&& echo "JWT_SECRET_KEY=secretKey1010" >> /app/.env

echo "++++++++++++++++++++++++++++++++++++++++++++"
echo "DATABASE_HOST=$DATABASE_HOST"
echo "JWT_SECRET_KEY=$JWT_SECRET_KEY"
echo "++++++++++++++++++++++++++++++++++++++++++++"

exec yarn serve
