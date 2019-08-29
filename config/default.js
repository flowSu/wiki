let base = process.env.NODE_ENV_BASE || '/'
const utils = require('../build/utils')

// 载入个性化配置
let related = utils.noCacheRequire('../config/related')
let standards = utils.noCacheRequire('../config/standards')
let review = utils.noCacheRequire('../config/review')

module.exports = {
  base,
  port: 6001,
  title: 'flowSu WIKI',
  description: 'flowSu study && share Wiki',
  // 修改dest需要同步修改package.json中的dist
  dest: 'dist',
  themeConfig: {
    nav: [
      {
        text: '前端规范',
        items: [
          {text: 'Markdown规范', link: '/docs/standards/markdown'},
          {text: '编码规范', link: '/docs/standards/code'},
          {text: '代码管理规范', link: '/docs/standards/git'}
        ]
      },
      {
        text: '相关文档', 
        items: [
          {text: 'Markdown入门', link: '/docs/related/base'},
          {text: 'YAML教程', link: '/docs/related/yaml'},
          {text: 'BEM规范', link: '/docs/related/bem'}
        ]
      }
    ],
    sidebar: [
      '/',
      standards.sidebar,
      related.sidebar,
      review.sidebar
    ],
    sidebarDepth: 0,
    repo: 'https://github.com/flowSu',
    editLinks: true
  },
  style: {
    override: {
      // 链接颜色
      accentColor: '#0081ff',
      // 文字颜色
      textColor: '#2c3e50',
      // border颜色
      borderColor: '#eaecef',
      // 代码块背景色
      codeBgColor: '#282c34'
    }
  }
}
