const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('<h2>Hello, world!</h2>')
})

app.listen(3000, () => {
  console.log('Succeed in running on port 3000.')
})