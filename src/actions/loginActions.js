import actionTypes from './actionTypes';
import {
  login
} from '../server';

const startLogin = () => {
  return {
    type: actionTypes.START_LOGIN
  };
};

const loginSUCCESS = (useInfo) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload: {
      useInfo
    }
  };
};
export const loginFailed = () => {
  window.localStorage.removeItem("isToken");
  window.localStorage.removeItem('userInfo');
  window.sessionStorage.removeItem("isToken");
  window.sessionStorage.removeItem("userInfo");
  return {
    type: actionTypes.LOGIN_FAILED
  };
};

export const toLogin = loginUserInfo => {
  return dispatch => {
    dispatch(startLogin());
    login(loginUserInfo)
      .then((data) => {
        // 一般着这里需要做错误判断，由于是用模拟数据，所以只是假设性的判断下
        if (data.loginMsg === 200) {
          const {
            isToken,
            ...userInfos
          } = data.useInfo;
          // 成功
          //如果用户点击记住我,将信息存储在LocalStorage
          if (loginUserInfo.remember === true) {
            window.localStorage.setItem("isToken", isToken);
            window.localStorage.setItem("userInfo", JSON.stringify(userInfos));
          } else { //没有点击记住我，则设置到seeionStorage中
            window.sessionStorage.setItem("isToken", isToken);
            window.sessionStorage.setItem("userInfo", JSON.stringify(userInfos));
          }
          dispatch(loginSUCCESS(userInfos));
        } else {
          //失败
          dispatch(() => {
            return {
              type: actionTypes.LOGIN_FAILED
            };
          });
        }
      });
  };
};

export const changeAvatar = (avatarUrl) => {
  return {
    type: actionTypes.CHANGER_AVATAR,
    payload: {
      avatarUrl
    }
  };
};
export const saveModifyAvatar = () => {
  return {
    type: actionTypes.SAVE_MODIFYPP_AVATAR
  };
};