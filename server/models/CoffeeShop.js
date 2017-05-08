var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CoffeeShop = new Schema({
  checkedInUsers: [],
  place_id: {
    type: String,
    unique: true
  },
});

CoffeeShop.methods.addUser = function(user, cb){
  console.log('CoffeeShop...addingUser')
  this.checkedInUsers.push(user)
  this.save( cb )
}
CoffeeShop.methods.removeUser = function(user, cb){
  console.log(user, ' before: ', this.checkedInUsers)
  var users = this.checkedInUsers.filter( function(x){
    return x !== user
  })
  this.checkedInUsers = users
  console.log('after: ', this.checkedInUsers)
  this.save(cb)
}
module.exports = mongoose.model("CoffeeShop", CoffeeShop)
