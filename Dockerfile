FROM node:14

RUN mkdir -p /app
WORKDIR /app

# Copy package.json and package-lock.json first to
# install dependencies.
COPY package.json package-lock.json /app/
RUN npm install

# Then, copy application files and build it.
COPY index.js webpack.config.js /app/
COPY index.html /app/
RUN npm run build

# Finally, copy main.js as the entrypoint.
COPY main.js /app/

CMD exec node --enable-source-maps main.js 8888
