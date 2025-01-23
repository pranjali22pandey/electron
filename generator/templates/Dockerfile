### build stage
FROM dockerregistry-v2.vih.infineon.com/node:18.17.0

RUN npm config set registry https://artifactory.intra.infineon.com/artifactory/api/npm/npm-npm-registry/
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package.json ./
COPY .npmrc ./

RUN npm install

# copy project files and folders to the current working directory
COPY . .

# build app for production
RUN npm run build

EXPOSE 5173
CMD [ "http-server", "dist" ]
