const express = require('express')
const passport = require('passport')
const cookie_session = require('cookie-session')
const mongoose = require('mongoose')
require('./models/User')

const key = require('./config/keys')
require('./services/passport')

const app = express()

mongoose.connect(key.MONGO_URL)

//adding cookie & passport middleware
app.use(cookie_session({
  name: 'session',
  keys: [key.COOKIE_KEY],
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secret: true
}))

app.use(passport.initialize())
app.use(passport.session())

require('./routes/authRoutes')(app)
require('./routes/billingRoutes')(app)

//get port from env variable passed by Heroku or use local port
const port =  process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// TODO
// Create a user model with id, email and cookie
// Check if user is in DB if YES, get cookie and deserialize
// IF user doesn not exist, serialize and store cookie



// DONE - Install necessary packages like passport, google etc 
// DONE - Setup routes for handling auth
// DONE - Add the required middleware to setup auth (i think)
// DONE - Have some kind of function to handle authentication

