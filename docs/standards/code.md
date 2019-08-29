<!-- ---
sidebar: false
--- -->

编码规范（PC/H5）
=================

## 目录
[[toc]]


## 代码规范

### 基础规范

基础规范部分会通过EsLint做强制检查，已经加入到EsLint规范文件中，编译环境将依照规范做强制检查，违规即实时抛出错误。这部分之后会不断完善EsLint Rules
具体来说，大致有以下方面：

1. 继承ES6风格，如变量、常量、函数以及类的定义
2. 末尾不加结束分号，字符串使用单引号
3. 表达式后要加空格，在每个声明块的左花括号前添加一个空格，比如：

```js
if (isEqual(name, '马冬梅')) {
  // TODO
}
```

4. 每条声明语句的 : 后应该插入一个空格
5. 注释后加空格，包括 `//` 和 `/**/`
6. 空格最多连续一个
7. 隔行最多空一行
8. 行首缩进采用两个space (tab)

### 软规范

软规范不太容易通过代码层面做强制限制（之后会抽时间研究开发一些小工具），需要开发人员在编写代码的时候，统筹考虑，多加注意

#### 变量命名：

1. 一般变量采用驼峰形式，如：fofUserName
2. 常量采用大写字母加下划线，如：FOF_USER_NAME
3. 变量名要采用具有清晰语义的单词，禁止拼音 + 英文单词的方式，比如给“左上”命名变量：

```js
// 错误
let zuoTop = true

// 正确
let leftTop = true
let upperLeft = true
```

| 动词 | 含义 | 返回值 |
| ---- | ---- | ---- |
| can | 判断是否可执行 | 返回布尔值 true为可执行 false 不可执行 |
| has | 判断是否含有某个值 | 返回布尔值 true 含有此值 false 不含此值 |
| is | 判断是否为某个值 | 返回布尔值 true 为某值 false 不为某值 |
| get | 获取某个值 | 一般为对象 |
| set | 设置某个值 | 无返回值 |
| load | 加载某些数据 | 无返回值或返回加载结果 |
| init | 初始化 | 一般无返回值 |

#### 字符串：
字符串采用ES6模板拼接方式，如：`早上好，欢迎${user.name}！`

#### Right Margin：
或者叫标尺、Ruler，JS代码禁止超限，Html不强制要求，但推荐控制在标尺以内

#### 换行：
Array和Object如果不能在标尺以内单行显示，就要换行显示，如：

```js
let arr = [
  'Dashboard',
  'Menu',
  'Navbar',
  'Content'
]
let obj = {
  Dashboard: true,
  Menu: false,
  Navbar: true
}
```

object不管有几个子元素，强制换行。针对较长的三元表达式，可通过换行来处理，操作符须要放在行首，如：

```js
let val = isEmpty(value)
  ? aaaa
    ? bbbb
    : cccccccc
  : dddd
```

#### 逻辑片段：
代码的一个个的逻辑片段用一个空行来分割

#### 注释：
文件顶层注释、函数以及类的注释用 `/**/` ，行内注释使用 `//`

#### import：
import文件时，js文件，vue文件不可扩展名，如：

```js
// 错误
import Utils from '@/common/utils.js'
// 正确
import Utils from '@/common/utils'
// 错误
import Form from '@/components/form.vue'
// 正确
import Form from '@/components/form'

// 导入多个模块时模块（超过三个模块时）要换行，如：
// 错误
import {isEnpyt, isEqual, cloneDeep} from 'lodash'
// 正确
import {
  isEmpty,
  isEqual,
  cloneDeep
} from 'lodash'
```

import三方模块放文件最上放，空一个行，放自定义组件

#### 状态管理：
以vuex为例，系统的每个功能模块写一个单独的文件，禁止把多个功能模块的状态混在一起。
每个模块的mutation types定义在模块内部，须加前缀，前缀一般为大写模块名，模块的大致写法如下：

```js
/**
 * 状态管理模块编写demo
 */
import Vue from 'vue'

const FILE_LIST = 'FILE_LIST'
const FILE_DETAIL = 'FILE_DETAIL'
const FILE_REMOVE = 'FILE_REMOVE'

const state = {
  detail: null
}

const mutations = {
  [FILE_DETAIL] (state, detail = null) {
    state.detail = detail
  }
}

const actions = {
  // 文件详情
  [FILE_DETAIL] ({commit}, id) {
    // TODO
  }
}

export default {
  state,
  mutations,
  actions
}
```

#### Vue文件内部样式：
除非特殊情况，否则不推荐使用scoped方式。同时，需要给样式表添加限定词（id或class）

#### async/await：
异步操作采用async await方式，保证代码简约干净

::: warning 注意
1. async-await不可滥用，如果需要并发处理，可使用Promise.all来处理
2. 异常处理部分约定在发起http请求的底层做统一处理，一般catch http层的常见错误
:::

#### 模板内组件格式：
如果组件没有props要传，直接写一行，如：`<feed></feed>`

如果组件有props需要传，则需要换行并对齐，如：

```html
<feed
  type="Menu"
  forceToggle
  :realmId="detail.realmId"
  @updated="updateHandler">
</feed>
```

如果组件有slot，也需要换行对齐，如：

```html
<feed>
  <button>click me</button>
</feed>
```

#### css相关：

1. class或id命名采用小写英文单词 + 横线(破折号)的方式，如：.btn, .btn-primary
2. 避免过度任意的简写。.btn 代表 button，但是 .s 不能表达任何意思
3. 不使用简单的方位词直接命名，如“left”，“bottom”
4. class 名称应当尽可能短，并且意义明确
5. 使用有意义的名称。如：.form-control, .form-item
6. 最高层级的class采用jq-作为前缀，如：.jq-row, .jq-row-content
7. 针对less/scss/stylus语法嵌套，除非有必要限制父级class，否则不要无限制嵌套
8. 长名称或词组可以使用下划线作为连接符
9. [BEM命名规范](/docs/related/bem.html)
10. 注释 
  * 用来区分页面级的注释 /** 产品中心 **/
  * 用来区分模块级的注释 /* 首页导航栏 */

常用css类名语义化对照表

| css类名        | 说明      |
| ------------- |---------  |
| wrapper  | 页面外围控制整体 |
| container  | 容器 |
| layout | 布局 |
| head header | 头部 |
| foot footer | 底部 |
| nav | 导航 |
| sub_nav | 二级导航 |
| menu | 菜单 |
| sub_menu | 二级菜单 |
| sidebar | 侧边栏 |
| sidebar_l, sidebar_r | 左边栏或右边栏 |
| main content | 页面主体 |
| tag | 标签 |
| msg | 提示信息 |
| tips | 小技巧 |
| link | 链接 |
| title | 标题 |
| summary | 摘要 |
| login | 登录 |
| search | 搜索 |
| hot | 热点 |
| copyright | 版权 |
| brand | 商标 |
| logo | logo标志 |
| regsiter | 注册 |
| service | 服务 |
| arrow | 箭头 |
| guide | 指南 |
| list | 列表 |
| detail | 详情 |
| home | 首页 |
| toolbar | 工具条 |
| breadcrumb | 面包屑 |
| drop | 下拉 |
| dorp_menu | 下拉菜单 |
| status | 状态 |
| scroll | 滚动 |
| tab | 标签页 |
| news | 新闻 |
| banner | 广告条 |
| download | 下载 |
| upload | 上传 |
| left right center | 左右中 |

## 工程结构

用于目前有以vue-cli2为脚手架搭建的工程，也有以vue-cli3为脚手架搭建的工程

vue-cli2采用经典的目录结构，基本含义如下：

```yaml
build: dev server以及打包脚本
config: 开发环境和生产环境的配置文件，local.js不包含在版本库中
dist: 静态工程生产目录
docs: 系统的简要文档，一般为Markdown文件，如组件的用法，工具用法，系统的setup
src: 业务代码目录
  assets: 静态资源
  common: 通用模块
  components: 通用UI组件和逻辑组件
  pages: 业务模块组件
    coms: 通用业务组件
    home: 首页模块
      com: 首页的通用业务组件
        index: 首页的通用业务组件的入口文件
      index: 首页的入口文件
  permission: 权限相关
  plugin: 全局扩展插件
  router: 路由文件
  store: 状态管理
static: 静态文件目录
test: test case目录
```

vue-cli3的主流目录结构，基本含义如下：

```yaml
dist: 打包后静态工程生产目录
docs: 系统的简要文档，一般为Markdown文件，如组件的用法，工具用法，系统的setup
src: 业务代码目录
  assets: 静态资源
  common: 通用模块
  components: 通用UI组件和逻辑组件
  views: 业务模块组件
    coms: 通用业务组件
    home: 首页模块
      com: 首页的通用业务组件
        index: 首页的通用业务组件的入口文件
      index: 首页的入口文件
  permission: 权限相关
  plugin: 全局扩展插件
  router: 路由文件
  store: 状态管理
public: 静态文件目录
test: test case目录
```

#### 目录命名：
目录的命名包含结构目录命名和组件目录命名，两者采用相同的命名方式，即：

1. 尽量用一个小写单词来命名，如components，如果需要多单词，用横线分割，如: `auto-form` 或 `field-transfer`
2. 组件须单独建立目录，目录内以index.vue作为入口文件

#### 文件命名：
对于结构目录内的文件，命名方式也采用单词和横线的形式，除非必要，否则尽量用一个单词描述文件，如：dashboard.vue，user/com/dialog.vue

## 日志规范

生产环境会强制把js文件中写的console.log/console.info剔除

1. 在dev环境中添加的console信息，提交文件前要去掉
2. 关键数据点，或者不合乎业务逻辑的地方，要记得throw error，抛出必要错误堆栈信息
3. 部分日志数据要考虑区分dev环境和prod环境

## 文档规范

#### 系统文档：

系统文档是针对整个系统的使用说明，包括如何安装，如何跑dev server，如何build，如何测试，生产环境需要什么支持，一起其他一些必要说明，这个要写在根目录的readme.md文件中，如果内容过多，可分开写入docs目录，然后在readme.md中加入链接。

#### 组件及方法文档：

##### 组件：
要求设计组件的时候，必须新建一个目录，那文档就放在该组件的根目录里，默认文件名为readme.md。文档要体现组件的基本原理、参数说明、实例用法以及需要特别注意的地方。

##### 方法：
主要是指一些通用函数，也包括filter、validator和directive。要对方法的用途、参数以及返回值给出必要的描述，一般是在方法顶部加 `/**/` 格式的注释说明。

## 安全相关

主要是源头防范xss、csrf、点击劫持等常见的web安全问题

1. 对用户的输入内容做必要的校验
2. 用户输入的内容，避免不做escape处理直接显示
3. 慎用v-html指令来直接渲染html
4. html标签属性要用双引号
5. 避免打印敏感信息到页面或控制台
6. 原则上不允许有敏感数据注入window变量
7. 组件内部禁止把内部this暴露给全局变量

## 交互体验

1. 对表单做防抖（重复快速点击提交）处理
2. 对操作结果要给出必要提示和反馈
3. 适当的给出loading，缓解用户等待的痛苦

## 版本控制

### git版本控制

主要是指代码的版本控制，以git使用为例：

1. clone主库代码
2. pull主库代码
3. commit
4. 本地merge
5. 使用rebase来优化commit history，确保整洁
6. push到自己的远端
7. 发起Merge Request
8. Review
9. 最终Merge

以上为git(gitlab)的版本管理的基本用法，比较适合项目初期，当项目发布到生产环境，进入维护和迭代新feature的阶段，这种方式就不太合适了，此时我们会采用`gitflow`工作流的方案，以解决开发、预发布、生产等环境以及多人、多分支、多版本、多feature的协作问题，详情请查阅[git工作流](/docs/standards/git.html)了解

### svn版本控制


