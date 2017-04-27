var path = process.cwd() + '/server'

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
      res.sendFile( path + '/views/index.html')
    })

  app.route('/Login')
    .get( function(req, res){
      res.sendFile( path + '/views/Login.html')
    })

  app.route('/auth/twitter')
     .get( passport.authenticate('twitter'))
     
  app.route('/auth/twitter/callback')
    .get( passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/Login'
    }))
}
