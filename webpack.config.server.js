const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
    return [{
        mode: env && env.prod ? 'production' : 'development',
        stats: {
            modules: false
        },
        resolve: {
            extensions: ['.js', '.ts']
        },
        module: {
            rules: [
                { test: /\.css|\.html$/, use: 'raw-loader' },
                { test: /\.ts$/, include: /ClientApp/, loader: 'ts-loader' }
            ]
        },
        entry: {
            'main-server': [
                './ClientApp/boot.server.ts'
            ]
        },
        output: {
            path: path.join(__dirname, 'wwwroot', 'dist'),
            publicPath: 'dist/',
            filename: '[name].js'
        },
        optimization: {
            //minimize: env && env.prod,
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            },
            minimizer: [
                //new UglifyJsPlugin({}),
                //new OptimizeCSSAssetsPlugin({})
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: env && env.prod ? '[name].[hash].css' : '[name].css',
                chunkFilename: env && env.prod ? '[id].[hash].css' : '[id].css',

            }),
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                // Remove this line if you prefer inline source maps
                filename: '[file].map',
                // Point sourcemap entries to the original file locations on disk
                moduleFilenameTemplate: path.relative('./wwwroot/dist', '[resourcePath]')
            })
        ]
    }];
};