const SET_LOCATION = 'SET_LOCATION'
const SET_SHOPS = 'SET_SHOPS'
const SET_PHOTO = 'SET_PHOTO'
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const SET_REFERRER = 'SET_REFERRER'
const SET_SIGNUP_MSG = 'SET_SIGNUP_MSG'
const SET_LOGIN_MSG = 'SET_LOGIN_MSG'
const SET_USER_LIST = 'SET_USER_LIST'

function setLocation( loc ){
  return {
    type: SET_LOCATION,
    payload: loc
  }
}

function setShops( shops ){
  return {
    type: SET_SHOPS,
    payload: shops
  }
}

function setPhoto( photo ){
  return {
    type: SET_PHOTO,
    photo: photo
  }
}

function login(user){
  return{
    type: LOGIN,
    user: user
  }
}

function logout(){
  return{
    type: LOGOUT
  }
}

function setReferrer(ref){
  return{
    type: SET_REFERRER,
    payload: ref
  }
}

function setSignupMsg(msg){
  return{
    type: SET_SIGNUP_MSG,
    payload: msg
  }
}

function setLoginMsg(msg){
  return{
    type: SET_LOGIN_MSG,
    payload: msg
  }
}

function setUserList(list){
  return{
    type: SET_USER_LIST,
    payload: list
  }
}

module.exports = {
  SET_LOCATION,
  setLocation,
  SET_SHOPS,
  setShops,
  SET_PHOTO,
  setPhoto,
  LOGIN,
  login,
  LOGOUT,
  logout,
  SET_REFERRER,
  setReferrer,
  SET_SIGNUP_MSG,
  setSignupMsg,
  SET_LOGIN_MSG,
  setLoginMsg,
  SET_USER_LIST,
  setUserList
}
