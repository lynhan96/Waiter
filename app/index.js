import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'

import Navigator from 'lib/Navigator'
import Store from 'lib/Store'
import App from 'App'
import Login from 'pages/Login'
import ForgotPassword from 'pages/ForgotPassword'
import Dashboard from 'pages/Dashboard'

import MapTable from 'components/admin/maps/MapTable'

import Foods from 'pages/Foods'
import FoodOrders from 'pages/FoodOrders'

ReactDOM.render((
  <Provider store={Store}>
    <Router history={Navigator}>
      <Route path='/' component={App}>
        <IndexRoute component={Login} />
        <Route path='login' component={Login}/>
        <Route path='forgot-password' component={ForgotPassword}/>
        <Route path='dashboard' component={Dashboard} />
        <Route path='foods' component={Foods} />
        <Route path='food-orders' component={FoodOrders} />

        <Route path='map-tables' component={MapTable} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('website'))
