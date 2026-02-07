# build stage for building .ts files
FROM node:22-alpine as build

RUN mkdir /home/app

WORKDIR /home/app

COPY package.json .

RUN npm install --ignore-scripts

COPY . .

RUN npm run build

# prod stage for including only necessary files
FROM node:22-alpine as prod

RUN apk add --no-cache curl

# create a non-privileged user
RUN addgroup -S app && adduser -S app -G app

# set secure folder permissions
RUN mkdir -p  /app/build && chown -R app:app /app

# set non-privileged user
USER app

# set working directory
WORKDIR /app

# copy config file for better use of layers
COPY --chown=app:app package.json .

# install dependencies
RUN npm install --omit=dev --ignore-scripts

# copy dist folder from build stage to prod
COPY --from=build --chown=app:app /home/app/build /app/build

ENV NODE_ENV=production
ENV PORT=3000

# exposed port
EXPOSE 3000

CMD [ "npm", "start" ]

# exit
