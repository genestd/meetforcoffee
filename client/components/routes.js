import React from 'react'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import App from '../components/App'
import Home from '../components/Home'
import Details from '../components/Details'
import Login from '../components/Login'
import Signup from '../components/Signup'
import NotFound from '../../client/components/NotFound'

let routes =
(
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path='details/:id' component={Details} />
      <Route path='Login' component={Login} />
      <Route path='Signup' component={Signup} />
      <Route path='*' component={NotFound} />
    </Route>
)
export default routes
