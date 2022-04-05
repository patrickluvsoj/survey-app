const express = require('express')
const passport = require('passport')
const cookie_session = require('cookie-session')
const dev = require('./config/dev')


const app = express()


//adding cookie & passport middleware
app.use(cookie_session({
  name: 'session',
  keys: [dev.COOKIE_KEY],
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secret: true
}))

app.use(passport.initialize())
app.use(passport.session())


require('./routes/authRoutes')(app)


//get port from env variable passed by Heroku or use local port
const port =  process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// DONE - Install necessary packages like passport, google etc 
// DONE - Setup routes for handling auth
// DOEN - Add the required middleware to setup auth (i think)

// START HERE
// Have some kind of function to handle authentication
