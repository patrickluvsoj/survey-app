const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const dev = require('../config/dev')

// Used to serialize and deserialize user id 
passport.serializeUser(function(user, done) {
    done(null, user)
})

passport.deserializeUser(function(user, done) {
    done(null, user)
})

//separate passport related functionality into a separate file later
passport.use(new GoogleStrategy({
    clientID: dev.GOOGLE_CLIENT,
    clientSecret: dev.GOOGLE_SECRET,
    callbackURL: '/auth/google/redirect',
    passReqToCallback: true,
    proxy: true,
}, (profile) => {
    // other relevant parameters you get are...
    // accessToken, refreshToken, done 
    console.log(profile)
    return done(null, profile)
}))
