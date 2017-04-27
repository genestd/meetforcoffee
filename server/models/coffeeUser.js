var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CoffeeUser = new Schema({
  username: String
})

module.exports = CoffeeUser
