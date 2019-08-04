import React, { Component } from 'react';
import { adminRoute } from './Route';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Frame } from './component';
import { FinshSave, Notifit } from './views';
import { connect } from 'react-redux';

const navRoutes = adminRoute.filter((route) => route.isNav);
const stateMapToPros = (state) => {
  return { isLogin: state.login.isLogin };
};
@connect(stateMapToPros)
class App extends Component {
  render() {
    return (
      this.props.isLogin //判断是否登录，未登录则返回登录界面
        ?
        <Frame navRoutes={navRoutes}>
          <Switch>
            {adminRoute.map(route => {
              return (
                <Route key={route.pathName} path={route.pathName} exact render={routeProps => {
                  return <route.component {...routeProps} />;
                }} />
              );
            })}
            <Route path="/admin/finish" component={FinshSave} />
            <Route path="/admin/notifit" component={Notifit} />
            <Redirect to={adminRoute[0].pathName} from="/admin" exact />
            <Redirect to="/404" from="/" />
          </Switch>
        </Frame>
        :
        <Redirect to="/login" />
    );
  }
}
export default App;
