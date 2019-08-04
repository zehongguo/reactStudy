import actionTypes from "../actions/actionTypes";
//刷新的时候来重新加载这些，所以当有Storage时，这是都为true，就会初始化这些信息，达到强储存的效果
const isLogin = Boolean(window.localStorage.getItem("isToken")) || Boolean(window.sessionStorage.getItem("isToken"));
const userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || JSON.parse(window.sessionStorage.getItem("userInfo"));
const initState = {
  useInfo: {
    ...userInfo
  },
  isLogin,
  isLoading: false,
};


export default (state = initState, action) => {
  switch (action.type) {
    case actionTypes.START_LOGIN:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
          isLogin: true,
          useInfo: action.payload.useInfo,
      };
    case actionTypes.LOGIN_FAILED:
      return {
        isLogin: false,
          isLoading: false,
          isLoadingSuccess: false,

          useInfo: {
            id: "",
            usename: "",
            avatar: ""
          }
      };
    case actionTypes.CHANGER_AVATAR:
      return {
        ...state,
        useInfo: {
          id: state.useInfo.id,
          usename: state.useInfo.name,
          avatar: action.payload.avatarUrl
        }
      };
    case actionTypes.SAVE_MODIFYPP_AVATAR:
      //如果还是原来那张照片，则不触发事件
      if (userInfo.avatar === state.useInfo.avatar) {
        return {
          ...state
        };
      }
      //如果不是，则修改storage里面的avatar值
      userInfo.avatar = state.useInfo.avatar;
      if (window.localStorage.hasOwnProperty("userInfo")) {
        window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
      } else if (window.sessionStorage.hasOwnProperty("userInfo")) {
        window.sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
      return {
        ...state,
        useInfo: userInfo
      };
    default:
      return state;
  }
};