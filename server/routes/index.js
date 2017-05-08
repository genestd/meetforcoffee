var path = process.cwd() + '/server'
var axios = require('axios')
var request = require('request')
var CoffeeShop = require('../models/CoffeeShop')
var CoffeeUser = require('../models/coffeeUser')
module.exports = function(app, passport){

  function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
      return next()
    } else {
      res.redirect('/login')
    }
  }

  app.route('/')
    .get( function(req, res){
      res.sendFile( path + '/public/index.html')
    })

  app.route('/signup')
    .post( function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.json({success:false, reason:info.code, msg: info.msg}); }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.json({success: true, user: req.session.passport.user});
        });
      })(req, res, next);
    });

  app.route('/login')
    .post( function(req, res, next){
      passport.authenticate('local-login', function(err, user, info){
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.json({success:false, reason:info.code, msg: info.msg});
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.json({success: true, user: req.session.passport.user});
        });
      })(req, res, next);
    })

  app.route('/auth/twitter')
     .get( passport.authenticate('twitter'))

  app.route('/auth/twitter/callback')
    .get( passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/Login'
    }))

  app.get('/coffee*', function(req, res){
    var key = process.env.PLACES_KEY
    var lat = req.query.lat
    var long = req.query.long
    var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=' + key + '&location=' + lat + ',' + long + '&radius=5000&keyword=coffee'
    console.log(url)
    request.get(url).pipe(res)

  })
  app.get('/address*', function(req, res){
    var qry = req.query.address
    var key=process.env.GEOLOC_KEY
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + qry + '&key=' + key
    console.log(url)
      request.get(url).pipe(res)
  })
  app.get('/details/:id', function(req, res){
    var id = req.params.id
    var key=process.env.GEOLOC_KEY
    url = 'https://maps.googleapis.com/maps/api/place/details/json?key=' + key + '&placeid=' + id
    request.get(url).pipe(res)
  })

  app.get('/photos/:id', function(req, res){
    var id = req.params.id
    var key=process.env.GEOLOC_KEY
    url = 'https://maps.googleapis.com/maps/api/place/photo?key=' + key + '&maxwidth=200&photoreference=' + id
    console.log(url)
    request.get(url).pipe(res)
  })

  app.get('/userlist/:id', function(req, res){
    var id = req.params.id
    CoffeeShop.findOne({place_id: id}, function(err, shop){
      if(err) {console.log(err)}
      if( shop ){
        return res.json({userlist: shop.checkedInUsers})
      } else {
        return( res.json({userlist: []}))
      }
    })
  })

  /**
  * Check in Function = allows users to check into a coffee shop location
  * Algorithm: Get user -
  * 1. if they are already checked in, remove current check in from location, and from user
  * 2. check
  **/
  app.post('/checkin', function(req, res){
    var curr_username = (typeof req.body.user.local.username === undefined) ? req.body.user.twitter.username : req.body.user.local.username
    //If user is checked in somewhere,
    CoffeeUser.findOne( {_id: req.body.user._id}, function(err, user){
      if(err){ console.log(err)}
      if( user.checkedIn ){
        console.log('user is checked in somewhere')
        //Remove User from existing location
        CoffeeShop.findOne({place_id: user.checkInLocation}, function( err, shop){
          if(err){ console.log(err)}
          console.log('removing user ', user, 'from shop ', shop)
          shop.removeUser(curr_username, function(err, done){
            if(err){console.log(err)}
            //Add User to new location
            CoffeeShop.findOne({place_id: req.body.place}, function(err, shop){
              if(err){console.log(err)}
              if(!shop){
                shop = new CoffeeShop()
                shop.place_id = req.body.place
                shop.checkedInUsers = []
                shop.checkedInUsers.push(curr_username)
                console.log('2-addin user ', user, 'to shop ', shop)
                shop.save(function(err){
                  if(err){ console.log(err)}
                  return res.json({userlist: shop.checkedInUsers})
                })
              } else {
                console.log('3-addin user ', user, 'to shop ', shop)
                shop.addUser(curr_username, function done(err,shop){
                  if(err){console.log(err)}
                  return res.json({userlist: shop.checkedInUsers})
                })
              }
              //Update User's checkin location
              user.checkedIn = true
              user.checkInLocation = req.body.place
              user.save( function(err){
                if(err){console.log(err)}
                return
              })
            })
          })
        })
      } else {
        console.log('starting checkin to new location')
        //Add User to new Location
        CoffeeShop.findOne({place_id: req.body.place}, function( err, shop){
          if(err){ console.log(err)}
          console.log('shop', shop)
          if(!shop){
            shop = new CoffeeShop()
            shop.place_id = req.body.place
            shop.checkedInUsers = []
            shop.checkedInUsers.push(curr_username)
            console.log('4-addin user ', user, 'to shop ', shop)
            shop.save(function(err){
              if(err){ console.log(err)}
              return res.json({userlist: shop.checkedInUsers})
            })
          } else {
            console.log('5-addin user ', user, 'to shop ', shop)
            shop.addUser(curr_username, function done(err,shop){
              return res.json({userlist: shop.checkedInUsers})
            })
          }
          //Update Users checkin location
          user.checkedIn = true
          user.checkInLocation = req.body.place
          user.save( function(err){
            if(err){console.log(err)}
            return
          })
        })
      }
    })
  })

  app.post('/checkout', function(req,res){
    var userId = req.body.userId
    console.log(req.body)
    CoffeeUser.findOne({_id: userId}, function(err, user){
      if(err){ return console.log(err)}
      user.checkedIn = false
      user.checkInLocation = ''
      user.save(function(err, result){
        if(err){ return console.log(err)}
        CoffeeShop.findOne({place_id: req.body.place}, function(err, shop){
          if(err){ return console.log(err)}
          shop.removeUser( user.screenName, function(err, done){
            if(err){return console.log(err)}
            console.log('remove user said:', done)
            res.json({userlist: done.checkedInUsers})
          })
        })
      })
    })
  })
}
