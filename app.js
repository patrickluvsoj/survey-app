const express = require('express')
const app = express()

//get port from env variable passed by Heroku or use local port
const port =  process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})