const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/Users");

module.exports = function(passport) {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "api/v1/gauth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
        //     const newUser = {
        //         googleId: profile.id,
        //         displayName: profile.displayName,
        //         firstName: profile.name.givenName,
        //         lastName: profile.name.familyName,
        //         image: profile.photos[0].value
        //     }

        //     try {
        //         let user = await User.findOne({googleId: profile.id});
        //         if (user) {
        //             done(null, user);
        //         } else {
        //             user = await User.create(newUser);
        //             done(null, user);
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        })
    )

    passport.serializeUser((user, done) => { 
        done(null, user)
    });

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => done(null, user))
    })
}