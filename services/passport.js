const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const dev = require('../config/dev')

const mongoose = require('mongoose')
const UserSchema = mongoose.model('users')

// Reference this to understand serialize & deserialize
// https://stackoverflow.com/questions/29066348/passportjs-serializeuser-and-deserializeuser-execution-flow
// https://dev.to/samippoudel/google-oauth-using-typescript-expressjs-passportjs-mongodb-5el8

// Serialize the id as cookie and pass to browser
passport.serializeUser( (user, done) => {
    // this is not the google profile id. This is the mongo record id OID
    done(null, user.id)
})

// take cookie that user gives us and deserialize to a user model in Mongo
passport.deserializeUser( async (id, done) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        const user = await UserSchema.findById(id)
        done(err, user)
    }
    // console.log(id)
})


//separate passport related functionality into a separate file later
passport.use(
        new GoogleStrategy({
        clientID: dev.GOOGLE_CLIENT,
        clientSecret: dev.GOOGLE_SECRET,
        callbackURL: '/auth/google/redirect',
        proxy: true,
    }, async (accessToken, refreshToken, profile, email, done) => {
        console.log('refresh: ' + refreshToken)
        console.log('access' + accessToken)
        console.log('profile: ' + profile)            
        // Logic if user is new or existing
        const existingUser = await UserSchema.findOne({ user_id: profile.id })
        if (existingUser) {
            return done(null, existingUser)
        }

        const user = await new UserSchema({user_id: profile.id}).save()
        done(null, user)
    }
))  