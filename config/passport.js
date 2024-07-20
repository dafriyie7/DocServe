const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel'); // Adjust the path as necessary

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec(); // Use exec() to execute the query
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Local strategy for username/password login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        if (!user.verified) {
            return done(null, false, { message: 'Email not verified.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

module.exports = passport;