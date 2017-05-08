import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Actions from '../actions'
import axios from 'axios'

class Login extends React.Component {

  constructor(props){
    super(props)
  }

  login(event){
    event.preventDefault()
    let username = document.getElementById('username').value
    let pw = document.getElementById('password').value
    axios.post( '/login', {username: username, password: pw})
      .then( res=>{
        if( res.data.success ){
          console.log('login successful', res.data)
          //return to page
          this.props.actions.login(res.data.user)
          this.props.actions.setLoginMsg('')
          this.props.router.push(this.props.coffee.referrer)
        } else {
          console.log('login fail', res.data)
          if (res.data.reason === 1 || res.data.reason === 2){
            this.props.actions.setLoginMsg(res.data.msg)
          } else {
            this.props.actions.setLoginMsg('Unable to login')
          }
        }
      })
      .catch(err =>{
        console.log('err', err)
      })
  }

  signup(event){
    event.preventDefault()
    this.props.router.push('Signup')
  }

  render(){
    return(
      <div className='table'>
        <div className='header centerText'>
          <h2 className='noMargin'>LOGIN</h2>
        </div>
        <div className='results'>
          {this.props.coffee.loginMsg !== '' ? <div className='row'>{this.props.coffee.loginMsg}</div> : ''}
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
              <input className='login-input-button' type='button' value='Login' id="loginBtn" onClick={(e)=>this.login(e)}/>
            </span>
          </div>
          <div className='row'>
          </div>
          <div className='row'>
            <input className='login-input-button' type='button' value='Sign Up' id="signupBtn" onClick={(e)=>{this.signup(e)}}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(Login)
