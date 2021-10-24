# Dockerfile
FROM node:16-alpine as build

WORKDIR /usr/app
COPY . .
ENV NODE_ENV=production
ENV PORT=8080
ENV SOCKET_PORT=65080
RUN yarn install --frozen-lockfile --production=false
RUN yarn build

FROM node:16-alpine
WORKDIR /usr/app
COPY --from=build /usr/app .
EXPOSE 8080 65080
CMD yarn start