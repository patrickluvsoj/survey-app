const express = require('express')
const passport = require('passport')
const cookie_session = require('cookie-session')
const mongoose = require('mongoose')
const key = require('./config/keys')

const app = express()

//adding cookie & passport middleware 
const sessionMiddleware = cookie_session({
  name: 'session',
  keys: [key.COOKIE_KEY],
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secret: true
})

require('./models/User');
require('./models/Survey');
require('./services/passport');

mongoose.connect(key.MONGO_URL);

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// define a wrapper to wrap express middleware to socket middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"))
  }
});

//const requireSocketLogin = require('./middleware/requireSocketLogin');
  
io.on('connection', (socket) => {
  const userId = socket.request.session.passport.user;

  console.log(`New connection established: ${userId}`);
  
  socket.join(userId);
  console.log(`socket has joined following room: ${JSON.stringify(socket.rooms)}`);
}); 

//get port from env variable passed by Heroku or use local port
const port =  process.env.PORT || 5000

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app, io);
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
// Create a user model with id, email and cookie
// Check if user is in DB if YES, get cookie and deserialize
// IF user doesn not exist, serialize and store cookie



// DONE - Install necessary packages like passport, google etc 
// DONE - Setup routes for handling auth
// DONE - Add the required middleware to setup auth (i think)
// DONE - Have some kind of function to handle authentication

