const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const passport = require("passport");
const {v4:uuidv4} = require("uuid");
require("dotenv").config();
const User = require("../models/user.model");


passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://34.205.157.165:5000/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    let user = await User.findOne({ email: profile?.email }).lean().exec();
    if(!user){
        user = await User.create({
            email: profile?.email,
            password: uuidv4(),
            roles: ["customer"],
          });
    }
    return done(null,user);
  }
));

module.exports = passport;