//懒加载，只有当调用的时候才加载
import Loadable from 'react-loadable';
import {
  Loading
} from '../component';

const Login = Loadable({
  loader: () => import("./Login"),
  loading: Loading
});
const Dashboard = Loadable({
  loader: () => import("./Dashboard"),
  loading: Loading
});
const NotFound = Loadable({
  loader: () => import("./NotFound"),
  loading: Loading
});
const ArticleList = Loadable({
  loader: () => import("./Article"),
  loading: Loading
});
const Setting = Loadable({
  loader: () => import("./Setting"),
  loading: Loading
});
const ArticleEdit = Loadable({
  loader: () => import("./Article/edit"),
  loading: Loading
});
const FinshSave = Loadable({
  loader: () => import("./Article/FinshSave"),
  loading: Loading
});
const Notifit = Loadable({
  loader: () => import("./Notifi"),
  loading: Loading
});

export {
  ArticleList,
  Dashboard,
  Login,
  NotFound,
  Setting,
  ArticleEdit,
  FinshSave,
  Notifit
};