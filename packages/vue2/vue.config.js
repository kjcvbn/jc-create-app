const path = require('path');
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '~': __dirname,
        "@": path.resolve(__dirname,'src/')
      }
    }
  }
}