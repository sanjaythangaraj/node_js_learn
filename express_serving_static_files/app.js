const express = require('express')
const path = require('path')

const app = express()
const port = 8080

app.use('/assets', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.send(`
    <h1>Static Files Example</h1>
    <img src="/assets/image.jpg" alt="Logo">
  `);
});


app.listen(8080, () => {
  console.log(`Server listening at http://localhost:8080`)
})