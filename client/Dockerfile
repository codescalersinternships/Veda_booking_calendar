# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app

ENV VEDA_SERVER_DOMAIN=$VEDA_SERVER_DOMAIN

COPY client/package*.json ./
RUN yarn
COPY client/ .

RUN chmod +x /app/scripts/build-env.sh
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY ./nginx/prod.conf /temp/prod.conf

# Use the environment variable in the configuration file
RUN envsubst '$VEDA_SERVER_DOMAIN' < /temp/prod.conf > /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/scripts/build-env.sh /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "/usr/share/nginx/html/build-env.sh && nginx -g \"daemon off;\""]
# CMD ["nginx", "-g", "daemon off;"]
