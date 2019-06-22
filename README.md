# a cli-to-gui-workflow Tool

> 运行环境：`node v8` + electron v4.0 + macOSX v10.13 `目前仅在mac环境下使用，windows环境暂时没运行过`

1. 安装electron项目依赖：根目录`npm install`
2. 安装react项目依赖：react目录下 `npm install`

## 开发环境下
3. 运行react项目：react目录下`npm start`
4. 运行electron：根目录`npm start`

## 生产打包
3. 打包react：react目录下`npm run build`
4. 打包electron：根目录下`npm run dist` 或者 `npm run pack`(自测使用)

### TODO
[] 右键菜单支持刷新项目信息

[] 换肤

[] redux-saga + redux middleware实现数据持久化

[] shell终端现场方案：https://github.com/Yomguithereal/react-blessed

[] electron如何优雅地抛出错误

[] electron本地安装程序后如何实现自动更新