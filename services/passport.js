const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const key = require('../config/keys')

// console.log(`Key client and Secret ${key.GOOGLE_CLIENT} AND ${key.GOOGLE_SECRET}`) 

const mongoose = require('mongoose')
const UserSchema = mongoose.model('users')

// Reference this to understand serialize & deserialize
// https://stackoverflow.com/questions/29066348/passportjs-serializeuser-and-deserializeuser-execution-flow
// https://dev.to/samippoudel/google-oauth-using-typescript-expressjs-passportjs-mongodb-5el8

// Serialize the id as cookie and pass to browser
passport.serializeUser( (user, done) => {
    // this is not the google profile id. This is the mongo record id OID
    console.log('serialize cookie')
    done(null, user.id)
})

// take cookie that user gives us and deserialize to a user model in Mongo
passport.deserializeUser( async (id, done) => {
    console.log('de-serialize cookie')
    if (mongoose.Types.ObjectId.isValid(id)) {
        const user = await UserSchema.findById(id)
        done(null, user)
    }
})

//separate passport related functionality into a separate file later
passport.use(
        new GoogleStrategy({
        clientID: key.GOOGLE_CLIENT,
        clientSecret: key.GOOGLE_SECRET,
        callbackURL: '/auth/google/redirect',
        proxy: true,
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('handle auth request')
        // console.log('refresh token: ' + refreshToken)
        // console.log('access token: ' + accessToken)
        // console.log('profile: ' + profile)
        // console.log(`profile id: ${profile.id}`) 

        // Logic if user is new or existing
        const existingUser = await UserSchema.findOne({ user_id: profile.id })
        console.log('checked for existing user')
        if (existingUser) {
            return done(null, existingUser)
        }

        const user = await new UserSchema({user_id: profile.id}).save()
        console.log('created new user')
        done(null, user)
    }
))