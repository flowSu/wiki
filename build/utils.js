const path = require('path')

exports.resolve = (dir = '') => {
  return path.resolve(__dirname, '..', dir)
}

exports.noCacheRequire = (url) => {
  delete require.cache[require.resolve(url)]
  return require(url)
}
