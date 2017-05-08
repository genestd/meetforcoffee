require('dotenv').config()
var express = require('express')
var passport = require('passport')
require('./auth/passport')(passport);
var session = require('express-session')
var mongoose = require('mongoose')
mongoose.connect('mongodb://' + process.env.MONGO_USER + ":" + process.env.MONGO_PASSWORD + '@' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB)
var bodyParser = require('body-parser')

var routes = require('./routes')

var app = express()
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json())
app.use(session({
  secret: "coffeeclub",
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 60 * 60}
}))

app.use(passport.initialize())
app.use(passport.session())

routes(app, passport)

app.use(express.static(__dirname+'/public'))
console.log(__dirname+'/public')
var listener = app.listen( process.env.PORT, function(){
  console.log('Your app is listening on port ' + process.env.PORT)
})
