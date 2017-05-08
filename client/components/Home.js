import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Actions from '../actions'
import axios from 'axios'
import Loading from '../components/Loading'
import Shop from '../components/Shop'

class Home extends React.Component{
  constructor(props){
    super(props)
  }

  componentDidMount(){
    if(navigator.geolocation){

      navigator.geolocation.getCurrentPosition(
        //success callback
        position => this.getLocalShops(position),
        //error callback
        err => {
          results.removeChild(document.getElementById('message'))
          var errMsg = document.createElement('div')
          errMsg.setAttribute("class", 'row')
          errMsg.setAttribute("id", "message")
          errMsg.appendChild(document.createTextNode("Enter your location to find local coffee shops"))
          results.appendChild(errMsg)
          console.log(err)
        }
      )
    }
  }

  getLocalShops(position){
    axios.get('/coffee?lat='+position.coords.latitude+'&long='+position.coords.longitude)
    .then( res=>{
      this.props.actions.setLocation(position.coords)
      this.props.actions.setShops(res.data.results)
    })
    .catch(function (error) {
      console.log('axios err', error);
    });
  }

  getCoords(event){
    event.preventDefault()
    var bar = document.getElementById('searchBar')
    var val = bar.value
    bar.value = ''
    axios.get('/address?address=' + val)
      .then( response =>{
        let position = {
          coords: {
            latitude: response.data.results[0].geometry.location.lat,
            longitude: response.data.results[0].geometry.location.lng
          }
        }
        this.getLocalShops(position)
        console.log('address response: ', response)
      })
      .catch( err=>{
        console.log('err', err)
      })
  }

  render(){
    let shops = (
      this.props.coffee.shops.map( (shop,index)=>{
        return ( <Shop data={shop} key={shop.place_id} index={index}/>)
      })
    )
    return (
      <div className='container'>
      <h1>Meet for Coffee</h1>
        <div className='content'>
          <form id="search">
            <input type='text' id='searchBar' className='locationInput' placeholder="Location..."/>
            <input type='button' className='locationBtn' value='Search' id="srchBtn" onClick={(e)=>this.getCoords(e)}/>
          </form>
          <div className='table'>
            <div className='header'>
              <span className='cafe-name'>Name</span>
              <span className='cafe-address'>Location</span>
              <span className='cafe-rating'>Rating</span>
            </div>
            <div id='results' className='results'>
              { this.props.coffee.location === undefined ? <Loading msg="Searching for local coffee shops..."/> : shops }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return( {coffee: state.coffee})
}
const mapDispatchToProps = (dispatch) => {
  return({
    actions: bindActionCreators(Actions, dispatch)
  })
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)
