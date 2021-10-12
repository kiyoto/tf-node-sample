# Treasure Functions JavaScript application sample

## Running code locally

If you have installed Docker, using docker is the best approach to run the code.

### 1. Build a docker image

```
$ docker build --rm -t td-func-sample:latest .
```

See Dockerfile to learn and customize build script.

### 2. Run the built image

```
$ docker run -p 8888:8888 --init --rm -it td-func-sample:latest
```

Above command starts your app on http://localhost:8888. Try following endpoints:

```
$ curl http://localhost:8888/index.js
$ curl http://localhost:8888/index.html
```

### 3. Copy the built code from the image

```
$ docker run -v "`pwd`:/mnt" --rm td-func-sample:latest cp /app/dist/app.js /mnt/
```

This command copies the built code as ./app.js.

### 4. Deploy the code

The ./app.js file includes the entire code bundled as a single-line JavaScript. Open it using a text editor, copy the first line, and paste it on the Treasure Functions Management UI.


## Customizing code

* index.js is the file that implements REST API endpoints. You add more endpoints or remove endpoints in this file. See [documents of express.js](https://expressjs.com/) to learn about the Express web framework.

* index.html is a file loaded from index.js at `require('./index.html')` line. You can use this `require(...)` syntax to split code into multiple files. Files are loaded as different object types depending the file name suffix.

* webpack.config.js defines the file loading behavior. It defines .text, .html, .css, .json, and .yaml file name suffixes to be loaded as raw strings. You can customize the behavior if you have special requirements. See [documents of webpack](https://webpack.js.org/) to learn about webpack.

* main.js is the code that runs first (a.k.a. "main" routine). It loads application code from ./dist/app.js, which is built based on package.json.

* package.json defines how the code should be built. In the default configuration, `npm run build` command runs webpack and creates the bundled code to ./dist/app.js. This also defines 3rd party dependency libraries to use.

* package-lock.json should be updated whenever you add/remove 3rd party dependency libraries. See [documents of npm](https://docs.npmjs.com/) to learn about npm.

Once you customize the code, repeat above step #1 to #3. Then do #4 to make it publicly available.

### Sample customization - swagger-ui-express

This tutorial covers a comprehensive customization procedure.

First, customize index.js. This sample uses following script:

```
const express = require('express');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = JSON.parse(require('./swagger.json'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.redirect(302, '/api-docs');
});

module.exports = app;
```

The script uses a 3rd party library named swagger-ui-express. Update package.json and package-lock.json files using following command:

```
$ npm install --save swagger-ui-express
```

The script is loading ./swagger.json file. Download it using following command:

```
$ curl -o swagger.json https://petstore.swagger.io/v2/swagger.json
```

The index.html file is no longer necessary:

```
$ rm -f index.html
```

Update Dockerfile and apply following change:

```
#COPY index.html /app/   # remove this line
COPY swagger.json /app/  # add this line
```

As reported at https://github.com/scottie1984/swagger-ui-express/issues/90, swagger-ui-express has a known issue with webpack. To fix it, add another library using following command:

```
$ npm install --save-dev copy-webpack-plugin
```

Then, make following two changes to ./webppack.config.js:

```
// Add this line right after "const path = ..." line:
const CopyWebpackPlugin = require("copy-webpack-plugin");
```

```
// Also add this section right before the last "};" line:
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        'node_modules/swagger-ui-dist/swagger-ui.css',
        'node_modules/swagger-ui-dist/swagger-ui-bundle.js',
        'node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
        'node_modules/swagger-ui-dist/favicon-16x16.png',
        'node_modules/swagger-ui-dist/favicon-32x32.png'
      ]
    })
  ],
```

Finally, follow above #1 - #2. You'll have an app served on http://localhost:8888.

