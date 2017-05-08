var combineReducers = require('redux').combineReducers
var coffeeReducer = require ('../reducers/coffeeReducer')

const rootReducer = combineReducers({
  coffee: coffeeReducer
})

module.exports = rootReducer
