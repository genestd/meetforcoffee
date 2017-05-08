var passport = require('passport')
var CoffeeUser = require('../models/coffeeUser')
var twitterAuth = require('./twitterAuth')
var LocalStrategy = require('passport-local').Strategy
var TwitterStrategy = require('passport-twitter').Strategy

module.exports = function(passport){
  passport.serializeUser(function(coffeeUser,done){
    done(null, coffeeUser)
  })

  passport.deserializeUser( function(userProfile, done){
    CoffeeUser.findById(userProfile._id, function(err, user){
      done(err, user)
    })
  })

  passport.use( 'local-signup', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // pass back the entire request to the callback
    },
    function(req, username, password, done) {
      console.log('in local signup')
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      CoffeeUser.findOne({ 'local.username' :  username }, function(err, user) {
        // if there are any errors, return the error
        if (err)
            return done(err);

        // check to see if theres already a user with that email
        if (user) {
            return done(null, false, {code: 0, msg:'That screen name is already taken.'});
        } else {

            // if there is no user with that email
            // create the user
            var newUser = new CoffeeUser();

            // set the user's local credentials
            newUser.local.username = username;
            newUser.local.password = newUser.generateHash(password);
            newUser.screenName = username;

            // save the user
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
          }
        });
      });
    })
  )

  passport.use( 'local-login', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // pass back the entire request to the callback
    },
    function(req, username, password, done) {
      console.log('in local login')
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      CoffeeUser.findOne({ 'local.username' :  username }, function(err, user) {
          // if there are any errors, return the error
          if (err){
            return done(err);
          }
          // check to see if theres already a user with that email
          if (!user) {
            return done(null, false, {success: false, code:1, msg: 'No user with that screen name'})
          }

          if( !user.validPassword(password)){
            return done(null, false, {success: false, code:2, msg: 'Invalid password!'})
          }

          return done(null, user)
        });
      });
    })
  )

  passport.use(
    new TwitterStrategy(twitterAuth, function(accessToken, refreshToken, profile, done){
      // update the user if s/he exists or add a new user
      CoffeeUser.findOne({'username': profile.username}, function(err, user) {
        if(err) {
          return done(err);
        } else {
          if(user){
            return done(null, user, profile);
          } else {
            var newUser = new CoffeeUser()
            newUser.screenName = profile.username,
            newUser.save(function(err, user){
              if(err) {throw err}
              else{
                return done(null,user)
              }
            })
          }

        }
      })
    }))
}
