import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Actions from '../actions'
import axios from 'axios'
import Loading from '../components/Loading'
import UserList from '../components/UserList'
import {Link} from 'react-router'

class Details extends React.Component{
  constructor(props){
    super(props)
    this.place = this.props.coffee.shops[this.props.params.id]
  }

  componentDidMount(){
    let url = '/photos/'+this.place.photos[0].photo_reference
    axios.get(url)
      .then( res=>{
        if (res.data){
          console.log('setting photo')
          this.props.actions.setPhoto(res.data)
        } else {
          console.log('no photo')
          this.props.actions.setPhoto(undefined)
        }
      })
      .catch( err=>{
        console.log(err)
      })
    axios.get('/userlist/'+this.place.place_id)
      .then( res=>{
        this.props.actions.setUserList(res.data.userlist)
      })
      .catch( err=>{
        console.log(err)
      })
  }

  handleCheckIn = () =>{
    if( this.props.coffee.loggedIn){
      console.log('checkin-logged in')
      axios.post( '/checkin', {user: this.props.coffee.user, place: this.place.place_id})
        .then( res=>{
          console.log('details, checkin:', res.data)
          this.props.actions.setUserList(res.data.userlist)
        })
        .catch(err=>{
          console.log(err)
        })
    } else {
      console.log('checkin-logged out')
      this.props.actions.setLoginMsg('You must login to use the check in feature')
      this.props.actions.setReferrer(this.props.location.pathname)
      this.props.router.push('/Login')
    }
  }
  handleCheckOut = () =>{
    if( this.props.coffee.loggedIn){
      axios.post( '/checkout', {userId: this.props.coffee.user._id, place: this.place.place_id})
        .then( res=>{
          this.props.actions.setUserList(res.data.userlist)
        })
        .catch(err=>{
          console.log(err)
        })
    } else {
      this.props.actions.setLoginMsg('You must login to use the check out feature')
      this.props.actions.setReferrer(this.props.location.pathname)
      this.props.router.push('/Login')
    }
  }

  setReferrer=()=>{
    this.props.actions.setReferrer(this.props.location.pathname)
  }

  render(){
    console.log(this.props.coffee)
    let userlist
    if(this.props.coffee.loggedIn){
      if(this.props.coffee.userlist.length > 0 ){
        userlist = this.props.coffee.userlist.map( (user, index)=>{
          return <UserList data={user} key={index}/>
        })
        console.log('userlist: ', userlist)
      } else {
        userlist = "Be the first to check in!"
      }
    } else {
      userlist = (<span onClick={this.setReferrer}><Link to='/Login'>Log in</Link> to see who is checked in</span>)
    }
    let photo
    if (this.place.photos[0].photo_reference){
      photo = "https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyB3pZMGgwpwUhZs313dMZ_L9u9ZfW3TBaU&maxwidth=200&photoreference=" + this.place.photos[0].photo_reference
    } else {
      photo = 'loader.svg'
    }
    return(
      <div className='table'>
        <div className='header centerText'>
          <h2 className='noMargin'>{this.place.name} - Rating: {this.place.rating}</h2>
        </div>
        <div className='results'>
          <img className='photo' src={photo}/>
          <div className='row centerText'>
            {this.place.vicinity}
          </div>
          <div className='row'>
            <button className='check in' onClick={this.handleCheckIn}>Check In</button>
            <button className='check out' onClick={this.handleCheckOut}>Check Out</button>
          </div>
          <div className='header'>
            <h3 className='noMargin'>Users at this coffee shop:</h3>
          </div>
          {userlist}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return({
    coffee: state.coffee
  })
}
const mapDispatchToProps = (dispatch) => {
  return({
    actions: bindActionCreators(Actions, dispatch)
  })
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Details)
