## wiki开发及上线方式

## Setup

```bash
# 初始化操作，安装依赖
$ nbnpm install

# 启动dev server
$ npm run dev

# build for production
$ npm run build
```
## 结构说明

::: tip Tips
如果想在侧边栏新增一个react导航为例
:::

* 在config.js中新增react.js

* 如果react下有其他二级导航，参考wiki.js写法

* 如果react下无二级导航，参考 `default.js` 中 `sidebar` 起步写法

* docs下新建react文件夹

* react文件夹下新建相关 `.md` 文件

## 上线生产环境

wiki的生产环境一般是挂载在fe.newbanker.cn上，只需要在`package.json` 中的 `dist` 项配置下产出目录即可

`config.dest` 的值需要跟package.dest保持一致。

```json
{
  "dist": "dist"
}
```

<br />

高级配置请 [参考这里](/docs/related/senior.html)
