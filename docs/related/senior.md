Markdown 高级语法
=================

### 定义页面标题

```yaml
---
title: Blogging Like a Hacker
lang: zh-CN
---
```
`title` 和 `lang` 会自动设置到当前页面

### 定制meta信息

另外也可以指定额外的 `meta` 标签进行注入

```yaml
---
meta:
  - name: description
    content: description-here
  - name: keywords
    content: keywords-here
---
```

### 设置当前页面侧边栏

```yaml
---
# 连个值可选：auto / false
sidebar: auto
---
```

`auto` 会自动设置当前页的侧边栏（会覆盖config中设置的全局侧边栏），`false` 会强制关闭当前页的侧边栏


### 上一页/下一页链接

```yaml
---
# false表示禁用掉
prev: ./prev-page-link
next: false
---
```

### 编辑链接

会在每个页面的底部显示「编辑此页面」的链接，跳转到对应repo的文件上
```js
// 详情参照 config/default.js
module.exports = {
  themeConfig: {
    // 假定 GitHub或GitLab完整地址（是repo页面地址，不是repo的clone地址）
    repo: 'https://gitlab.newbanker.cn/nbfe/wiki',
    // 如果你的文档不在仓库的根部，可以设置该项
    docsDir: 'docs',
    // 默认为 master
    docsBranch: 'master',
    // 启用或禁用编辑链接
    editLinks: true
  }
}
```

### 更新时间

```js
// 详情参照 config/default.js
module.exports = {
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    lastUpdated: '上次更新'
  }
}
```


### 代码块某行高亮

````js
// 以下代码表示第4行高亮显示
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

``` js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

### 表格

```
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

1. | 、- 及 :之间的多余空格会被忽略，不影响布局。
2. 默认标题栏居中对齐，内容居左对齐。
3. -:表示内容和标题栏居右对齐，:-表示内容和标题栏居左对齐，:-:表示内容和标题栏居中对齐。
4. 内容和|之间的多余空格会被忽略，每行第一个|和最后一个|可以省略，-的数量至少有一个。

```md
| 左对齐标题 | 右对齐标题 | 居中对齐标题 |
| :------| ------: | :------: |
| 短文本 | 中等文本 | 稍微长一点的文本 |
| 稍微长一点的文本 | 短文本 | 中等文本 |
```

### 目录

通过 `[[toc]]` 可创建当前页面目录信息

<!-- [[toc]] -->

```bash
[[toc]]
```

<!-- [[toc]] -->


### page用法

每个页面都会有一个 `page` class，可通过编写css代码来统一控制页面样式

```html
<div class="jq-page">
  <!-->将此页面的md文件写在div内部，样式文件可以依据类名写在style.less中<-->
</div>
```

### pageClass

可以用`YAML`语法给某个页面添加 page class，方便对某个页面做特殊的样式处理

> 就是在md文件的开头写下下述容器中的内容

```yaml
---
pageClass: jq-page
---
```

关于`YAML`语法，想要了解更多，[点击这里](../related/yaml.md)

然后，样式可以写在 **.vuepress/style.less** 下 余下的就和css的书写无异

```css
.jq-page {
  /* page styles */
}
```