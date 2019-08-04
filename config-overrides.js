// module.exports = (config) => {
//   //在这里对config进行配置
//   return config
// }
const modifyVars = require("./config/theme");
const {
  override,
  addDecoratorsLegacy, //支持修饰器写法
  fixBabelImports,
  addLessLoader
} = require('customize-cra');

module.exports = override(
  addDecoratorsLegacy(),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true, //组件按需加载啊
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: modifyVars,
  }),
);