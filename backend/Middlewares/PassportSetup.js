const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/UserModel'); // Adjust the path according to your project structure
require('dotenv').config();
const jwt = require('jsonwebtoken');


// Configure Passport to use Google authentication strategy
passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/callback', // Callback URL to redirect to after Google authentication
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
}, async (accessToken, refreshToken, profile, done) => { // Callback function handling authentication process
    try {
        const email= profile.emails && profile.emails[0].value // Extract email from user profile if available
        const profilePicture = profile.photos && profile.photos[0].value;
        // Find or create a user based on their Google ID
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                username: profile.displayName,
                email: email, // Safely access the email
                googleId: profile.id,
                profilePicture,
                isVerified: true
            });
            await user.save();
        }

         // Generate JWT token
        const jwtToken = jwt.sign({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                isPublicProfile: user.isPublicProfile,
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3d' });

        // Pass the generated JWT token to authenticate the user
        // Pass the token as part of the done callback
        user.jwtToken = jwtToken;
        done(null, user); // User is found or created, continue
    } catch (error) {
        done(error, null);
    }
}));

// Serialize user to store in the session
passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize user by their ID
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); // Deserialize user
    } catch (error) {
        done(error, null);
    }
});
