const SET_LOCATION = require('../actions').SET_LOCATION
const SET_SHOPS = require('../actions').SET_SHOPS
const SET_PHOTO = require('../actions').SET_PHOTO
const LOGIN = require('../actions').LOGIN
const LOGOUT = require('../actions').LOGOUT
const SET_REFERRER = require('../actions').SET_REFERRER
const SET_SIGNUP_MSG = require('../actions').SET_SIGNUP_MSG
const SET_LOGIN_MSG = require('../actions').SET_LOGIN_MSG
const SET_USER_LIST = require('../actions').SET_USER_LIST

const INITIAL_STATE = {
  location: undefined,
  shops: [],
  photo: undefined,
  loggedIn: false,
  user: {},
  referrer: '',
  loginMsg: '',
  signupMsg: '',
  userlist: []
}

function coffeeReducer(state, action){

  if(state===undefined) state=INITIAL_STATE

  switch(action.type){
    case SET_LOCATION:
      return Object.assign({}, state, {location: action.payload})
    case SET_SHOPS:
      return Object.assign({}, state, {shops: action.payload})
    case SET_PHOTO:
      return Object.assign({}, state, {photo: action.photo})
    case LOGIN:
      return Object.assign({}, state, {loggedIn: true, user: action.user})
    case LOGOUT:
      return Object.assign({}, state, {loggedIn: false, user: {}})
    case SET_REFERRER:
      return Object.assign({}, state, {referrer: action.payload})
    case SET_SIGNUP_MSG:
      return Object.assign({}, state, {signupMsg: action.payload})
    case SET_LOGIN_MSG:
      return Object.assign({}, state, {loginMsg: action.payload})
    case SET_USER_LIST:
      return Object.assign({}, state, {userlist: action.payload})
    default:
      return state
  }
}
module.exports = coffeeReducer
