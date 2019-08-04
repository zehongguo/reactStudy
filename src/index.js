import {
  render
} from 'react-dom';
import App from './App';
import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import { mainRoute } from './Route';
import './css/index.css';

render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/admin" component={App} />
        {mainRoute.map(route => {
          return <Route key={route.pathName} component={route.component} path={route.pathName} />;
        })}
        <Redirect to="/login" from="/" exact />
        <Redirect to="/404" from="/" />
      </Switch>
    </Router>
  </Provider>
  , document.getElementById("root"));