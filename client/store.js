var createStore = require('redux').createStore
var rootReducer = require('./reducers/')

const store = createStore(rootReducer)

module.exports = store;
