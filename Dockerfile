# Dockerfile as described on
# https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html

# Builds the reternal-ui project during initial build-stage
FROM node:9.11.1-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runs output of reternal build-stage and hosts content
# via nginx service
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]