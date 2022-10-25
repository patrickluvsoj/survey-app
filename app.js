const express = require('express');
const passport = require('passport');
const cookie_session = require('cookie-session');
const mongoose = require('mongoose');
const key = require('./config/keys');

require('./models/User');
require('./models/Survey');
require('./services/passport');

mongoose.connect(key.MONGO_URL);

const app = express()

// Setup middleware: cookie and passport
const sessionMiddleware = cookie_session({
  name: 'session',
  keys: [key.COOKIE_KEY],
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secret: true
})

// app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

const http = require('http');
const server = http.createServer(app);

// get port from env variable passed by Heroku or use local port
const port =  process.env.PORT || 5000

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

// providing client assets in productoin 
if (process.env.NODE_ENV === 'production') {
  // give css & js static assets using express' built-in middleware
  app.use(express.static('client/build'));

  // give index.html if all other routes fail
  const path = require('path');

  app.get('*', (req, res) => {
    console.log('testing dirname' + __dirname);
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  });
}

// TODO
// - [ ] Review videos on Udemy
// - [ ] Fix routing so that when logged out, you only see homepage
// - [ ] Some auth issues and auth redirect screens?
// - [ ] Better styling for the review survey component
// - [ ] Improve date format and overall design in the survey list
// - [ ] Improve the email design/format for the template
// - [ ] Check if app can be deployed
// - [ ] Update URL in Sendgrid and Stripe
// - [ ] Improve spacing between Buy button and Credits
// - [ ] Be able to filter to unique users responding to survey in the survey_routes



// TODO
// Create a user model with id, email and cookie
// Check if user is in DB if YES, get cookie and deserialize
// IF user doesn not exist, serialize and store cookie

// DONE - Install necessary packages like passport, google etc 
// DONE - Setup routes for handling auth
// DONE - Add the required middleware to setup auth
// DONE - Have some kind of function to handle authentication


