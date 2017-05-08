import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import store from '../../client/store'
import App from '../../client/components/App'
import Home from '../../client/components/Home'
import routes from '../../client/components/routes'
import NotFound from '../../client/components/NotFound'
import '../../client/styles/main.scss'

ReactDOM.render(
  (<Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>), document.getElementById('app') );
