# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app

# Set the environment variable
ARG VITE_SERVER_DOMAIN
ENV VITE_SERVER_DOMAIN=$VITE_SERVER_DOMAIN

COPY client/package*.json ./
RUN yarn
COPY client/ .
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY ./nginx/prod.conf /temp/prod.conf

# Use the environment variable in the configuration file
RUN envsubst '$VITE_SERVER_DOMAIN' < /temp/prod.conf > /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
