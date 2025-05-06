const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const config = require('./socialAuth');
const User = require('../models/user');

module.exports = function(passport) {
  // Facebook Strategy
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      return done(null, req.user, { accessToken });
    } catch (err) {
      return done(err, null);
    }
  }));

  // Twitter Strategy
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL,
    passReqToCallback: true
  }, async (req, token, tokenSecret, profile, done) => {
    try {
      return done(null, req.user, { 
        accessToken: token,
        accessTokenSecret: tokenSecret
      });
    } catch (err) {
      return done(err, null);
    }
  }));

  // LinkedIn Strategy
  passport.use(new LinkedInStrategy({
    clientID: config.linkedin.clientID,
    clientSecret: config.linkedin.clientSecret,
    callbackURL: config.linkedin.callbackURL,
    scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      return done(null, req.user, { 
        accessToken,
        profile: {
          id: profile.id,
          email: profile.emails[0].value,
          name: `${profile.name.givenName} ${profile.name.familyName}`,
          profileUrl: profile.profileUrl
        }
      });
    } catch (err) {
      return done(err, null);
    }
  }));

  // Instagram Strategy
  passport.use(new InstagramStrategy({
    clientID: config.instagram.clientID,
    clientSecret: config.instagram.clientSecret,
    callbackURL: config.instagram.callbackURL,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      return done(null, req.user, {
        accessToken,
        profile: {
          id: profile.id,
          username: profile.username,
          fullName: profile.displayName,
          profilePicture: profile._json.data.profile_picture
        }
      });
    } catch (err) {
      return done(err, null);
    }
  }));

  // Serialize and deserialize user for sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};