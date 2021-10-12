const express = require('express');
const app = express();

////
// JSON-based API
//
app.use(express.json())

app.get('/index.js', (req, res) => {
  const body = {message: "Hello World!"};

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(body));
});


////
// HTML-based API
//

// See webpack.config.js that loads files with
// .html suffix as a raw string (asset/source).
const html = require('./index.html');

app.get('/index.html', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});


module.exports = app;
