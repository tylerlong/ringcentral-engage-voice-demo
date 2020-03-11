const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'production',
  output: {
    path: path.join(__dirname, 'docs')
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
