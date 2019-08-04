// 配置路由
import {
  ArticleList,
  Dashboard,
  Login,
  NotFound,
  Setting,
  ArticleEdit
} from '../views';

export const mainRoute = [{
  component: Login,
  pathName: "/login"
}, {
  component: NotFound,
  pathName: "/404"
}];
export const adminRoute = [{
  component: Dashboard,
  pathName: "/admin/dashboard",
  isNav: "true",
  title: "仪表盘",
  icon: "pie-chart"
}, {
  component: ArticleList,
  pathName: "/admin/article",
  title: "文章管理",
  isNav: "true",
  exact: true,
  icon: "edit"
}, {
  component: ArticleEdit,
  pathName: "/admin/article/edit/:id",
}, {
  component: Setting,
  isNav: true,
  pathName: "/admin/setting",
  title: "设置",
  icon: "setting"
}];