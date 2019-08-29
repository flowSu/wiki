## vue相关

## 1. Vue的小技巧

[Vue小技巧](https://juejin.im/post/5c905f45f265da60df410019)

[Vue拾遗](https://juejin.im/post/5c90b50f5188252d5a148793)

## 2. Vue面试相关

* vue-router如何做历史返回提示？
https://www.cnblogs.com/longm/p/vue-router.html

* Vue.js 服务器端渲染指南
https://ssr.vuejs.org/zh/#%E4%BB%80%E4%B9%88%E6%98%AF%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%B8%B2%E6%9F%93-ssr-%EF%BC%9F

* Vue 应用性能优化指南
https://juejin.im/post/5b960fcae51d450e9d645c5f

## nodejs面试相关

* node常用模块
https://www.cnblogs.com/cnshen/p/6272541.html

* nodejs请求如何返回大文件（如何实现断点续传）

https://cnodejs.org/topic/4f5b47c42373009b5c04e9cb

## ES6

* 说说Generator/yield与 async await
https://www.jianshu.com/p/c94edc0057fe

* 一维数组去重（二维数组去重）


## javascript

* new操作符的过程

```javascript
  var o = new Object()

  1. 新建一个对象o
  2. o.__proto__ = Object.prototype 将新创建的对象的__proto__属性指向构造函数的prototype
  3. 将this指向新创建的对象
  4. 返回新对象，但是这里需要看构造函数有没有返回值，如果构造函数的返回值为基本数据类型string、boolean、number、null、undefined那么久返回新对象，如果构造函数的返回值为对象类型，那么久返回这个对象类型
```

* 闭包问题
页面的li标签点击弹出（for循环 var i setTimeout(i) 问题）

* 原型及原型链
object1.__proto__ = object2.prototype

* 变量提升 
var 和 let

* ['1', '7', '11'].map(parseInt)

 返回 [1, NaN, 3]

 https://juejin.im/post/5d0202da51882546dd10087b

 ## css问题相关

 * 双飞翼布局或者圣杯布局
https://juejin.im/post/5a9813d6f265da237506506f

* 简要介绍下BEM
https://github.com/Tencent/tmt-workflow/wiki/%E2%92%9B-%5B%E8%A7%84%E8%8C%83%5D--CSS-BEM-%E4%B9%A6%E5%86%99%E8%A7%84%E8%8C%83

* 用纯CSS创建一个三角形的原理是什么？
```css
width : 0 ;
height : 0 ;
border -top : 40px solid transparent;
border -left : 40px solid transparent;
border -right : 40px solid transparent;
border -bottom : 40px solid #ff0000;
```

* 浏览器是怎样解析CSS选择器的？
CSS选择器的解析是从右向左解析的。若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的查找上面。而在 CSS 解析完毕后，需要将解析的结果与 DOM Tree 的内容一起进行分析建立一棵 Render Tree，最终用来进行绘图。在建立 Render Tree 时（WebKit 中的「Attachment」过程），浏览器就要为每个 DOM Tree 中的元素根据 CSS 的解析结果（Style Rules）来确定生成怎样的 Render Tree。

* 一个满屏品字布局如何设计?(回字形布局)
第一种真正的品字：

三块高宽是确定的；

上面那块用margin: 0 auto;居中；

下面两块用float或者inline-block不换行；

用margin调整位置使他们居中。

第二种全屏的品字布局:上面的div设置成100%，下面的div分别宽50%，然后使用float或者inline使其不换行。

## webpack面试题
https://juejin.im/post/5c6cffde6fb9a049d975c8c1

* import { Button } from 'antd' 分模块加载，是怎么做到的

通过 babel-plugin-import 配置处理。
```javascript
{
  "plugins": [
    ["import", {
      "libraryName": "antd",
      "libraryDirectory": "es",
      "style": "css"
    }]
  ]
}
```
相当于
```javascript
import Button from 'antd/es/button';
import 'antd/es/button/style/css';
```