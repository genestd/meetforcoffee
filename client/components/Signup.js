import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Actions from '../actions'

class Signup extends React.Component {
  constructor(props){
    super(props)
  }

  login(event){
    event.preventDefault()
    this.props.router.push('Login')
  }

  signUp(event){
    let username = document.getElementById('username').value
    let pw = document.getElementById('password').value
    axios.post( '/signup', {username: username, password: pw})
      .then( res=>{
        if( res.data.success ){
          console.log('signup successful')
          //return to page
          this.props.actions.login(res.data.user)
          this.props.actions.setSignupMsg('')
          this.props.router.push(this.props.coffee.referrer)
        } else {
          console.log('signup fail', res.data)
          if(res.data.reason===0){
            this.props.actions.setSignupMsg( res.data.msg)
          } else {
            this.props.actions.setSignupMsg( "Unable to complete Sign Up process")
          }
        }
      })
      .catch(err =>{
        console.log('err', err)
      })
  }

  render(){
    return(
      <div className='table'>
        <div className='header centerText'>
          <h2 className='noMargin'>SIGN UP</h2>
        </div>
        <div className='results'>
          {this.props.coffee.signupMsg !== '' ? <div className='row'>{this.props.coffee.signupMsg}</div> : ''}
          <div className='row'>
            <span className='login-input'><label className='login-label'>User Name:</label></span>
            <span className='login-span-60'><input className='login-input-value' type='text' id='username' placeholder="Screen Name"/></span>
          </div>
          <div className='row'>
            <span className='login-input'><label className='login-label'>Password:</label></span>
            <span className='login-span-60'><input className='login-input-value' type='password' id='password'/></span>
          </div>
          <div className='row'>
            <span className='login-input'>&nbsp;</span>
            <span className='login-span-60'>
              <input className='login-input-button' type='button' value='Sign Up' id="loginBtn" onClick={(e)=>this.signUp(e)}/>
            </span>
          </div>
          <div className='row'>
          </div>
          <div className='row'>
            <input className='login-input-button' type='button' value='Login with Twitter' id="twitterBtn" onClick={(e)=>this.loginTwitter(e)}/>
            OR
            <input className='login-input-button' type='button' value='Login' id="twitterBtn" onClick={(e)=>this.login(e)}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(Signup)
