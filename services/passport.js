const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const key = require('../config/keys')

const mongoose = require('mongoose')
const UserSchema = mongoose.model('users')

// References to understand serialize & deserialize in passport
// https://stackoverflow.com/questions/29066348/passportjs-serializeuser-and-deserializeuser-execution-flow
// https://dev.to/samippoudel/google-oauth-using-typescript-expressjs-passportjs-mongodb-5el8

// Serialize the id as cookie and pass to browser
passport.serializeUser( (user, done) => {
    // this is not the google profile id. This is the mongo record id OID
    console.log('serialize cookie')
    done(null, user.id)
})

// take cookie that user provide and deserialize to a user model in Mongo
passport.deserializeUser( async (id, done) => {
    console.log('de-serialize cookie')
    if (mongoose.Types.ObjectId.isValid(id)) {
        const user = await UserSchema.findById(id)
        done(null, user)
    }
})

passport.use(
        new GoogleStrategy({
        clientID: key.GOOGLE_CLIENT,
        clientSecret: key.GOOGLE_SECRET,
        callbackURL: '/auth/google/redirect',
        // passReqToCallback: true,
        proxy: true,
    }, async (req, accessToken, refreshToken, profile, done) => {
        // Logs to check info passed from Google auth
        // console.log('handle auth request')
        // console.log('refresh token: ' + refreshToken)
        // console.log('access token: ' + accessToken)
        // console.log('profile: ' + JSON.stringify(profile));
        // console.log('req: ' + req);

        // Logic ckecing if user is new or existing
        const existingUser = await UserSchema.findOne({ user_id: profile.id })
        
        if (existingUser) {
            console.log(`existing user: ${existingUser}`)
            return done(null, existingUser)
        }

        const user = await new UserSchema({user_id: profile.id}).save()
        console.log('created new user')
        done(null, user)
    }
))