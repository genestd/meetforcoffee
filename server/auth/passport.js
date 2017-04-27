var passport = require('passport')
var CoffeeUser = require('../models/coffeeUser')
var twitterAuth = require('./twitterAuth')
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
            newUser.username = profile.username,
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
