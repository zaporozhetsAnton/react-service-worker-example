const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.common.config');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        historyApiFallback: true,
        contentBase: './dist',
        hot: true,
        open: true,
        overlay: true,
        progress: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ],
});
