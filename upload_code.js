const axios = require('axios')
const fs = require('fs')
const instance = axios.create({
  baseURL: 'https://api-aciddb.treasuredata.com/api',
  headers: {'AUTHORIZATION': `TD1 ${process.env.TD_API_KEY}`, 'Content-Type': 'application/json'}
})

fs.readFile('dist/app.js', 'utf-8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  const desc = [
    process.env.GITHUB_SHA,
    `repo: ${process.env.GITHUB_REPOSITORY}`,
    `tag/branch: ${process.env.GITHUB_REF}`,

  ].join("\n")
  var payload = {
    "instanceId": "14", // Change this to the right instance ID
	  "namespace": "files",
	  "key": "app.js",
	  "secret": false,
	  "value": data,
	  "description": desc,
	  "valueEncoding": "string"
  }
  instance.post('/ctl/change_drafts', payload)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
})
