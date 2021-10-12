const app = require('./dist/app');
const port = process.argv[2] ?? 8888;
app.listen(port, "0.0.0.0", () => {
  console.log(`Start at http://localhost:${port}`)
})
