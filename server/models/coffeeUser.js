var mongoose = require('mongoose')
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema

var CoffeeUser = new Schema({
  local: {
    email: String,
    password: String,
    username: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  checkedIn: Boolean,
  checkInLocation: String,
  screenName: String
})

CoffeeUser.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
CoffeeUser.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model("CoffeeUser", CoffeeUser)
