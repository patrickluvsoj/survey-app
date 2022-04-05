const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const dev = require('../config/dev')


//separate passport related functionality into a separate file later
passport.use(new GoogleStrategy({
    clientID: dev.GOOGLE_CLIENT,
    clientSecret: dev.GOOGLE_SECRET,
    callbackURL: '/auth/google/redirect',
    scope: ['profile'],
    proxy: true,
}, (profile) => {
    // other relevant parameters you get are...
    // accessToken, refreshToken, done 
    console.log(profile)
}
))


module.exports = function authRoutes(app) {
    app.get('/auth/google', passport.authenticate('google'))

    app.get('/auth/google/redirect', passport.authenticate('google',))

    app.get('/logout', (req, res) => {
        console.log('dummy logout route')
        req.logout()
        res.redirect('/')
    })
}

