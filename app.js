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

require('./models/User')
require('./services/passport')

mongoose.connect(key.MONGO_URL)

app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())

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

//get port from env variable passed by Heroku or use local port
const port =  process.env.PORT || 5000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const requireSocketLogin = require('./middleware/requireSocketLogin');
  
io.on('connection', requireSocketLogin, (socket) => {
  const userId = socket.request.session.passport.user;

  console.log(`New connection established: ${userId}`);
  
  socket.join(userId);
  console.log(`socket has joined following room: ${JSON.stringify(socket.rooms)}`)
}); 

require('./routes/authRoutes')(app)
require('./routes/billingRoutes')(app, io)


// TODO
// Create a user model with id, email and cookie
// Check if user is in DB if YES, get cookie and deserialize
// IF user doesn not exist, serialize and store cookie



// DONE - Install necessary packages like passport, google etc 
// DONE - Setup routes for handling auth
// DONE - Add the required middleware to setup auth (i think)
// DONE - Have some kind of function to handle authentication

