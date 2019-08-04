import axios from 'axios';
import {
  apis
} from './apis';
import {
  message
} from 'antd';
const isDev = process.env.MODE_ENV = 'development';
const ajax = axios.create({
  baseURL: isDev ? apis.baseUrl : '',
});
//拦截请求，并加上token
ajax.interceptors.request.use((config) => {
  config.data = Object.assign({}, config.data, {
    isToken: 'tokenzaici'
  });
  return config;
});
//拦截响应，成功返回数据
ajax.interceptors.response.use((resq) => {
  if (resq.data.code === "200") {
    return resq.data.data;
  } else {
    //TODO全局处理
    message.error(resq.data.errMsg);
  }
});

export const getArticle = (offset = 0, limited = 10) => {
  return ajax.post(apis.getArticleList, {
    offset,
    limited
  });
};
export const deleteArticle = (id) => {
  return ajax.post(apis.deleteArticle);
};

export const getArticleById = (id) => {
  return ajax.post(apis.getArticle + id);
};

export const saveAricle = (id, values) => {
  return ajax.post(apis.saveAricle + id, values);
};

export const getStatisticsdata = () => {
  return ajax.get(apis.getStatisticsdata);
};
export const getNotificationsList = id => {
  return ajax.post(apis.getNotificationsList);
};
export const login = loginUserInfo => {
  return ajax.post(apis.login, loginUserInfo);
};