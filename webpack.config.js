const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = (env) => {
    return [{
        mode: env && env.prod ? 'production' : 'development',
        stats: {
            modules: false
        },
        resolve: {
            extensions: ['.js', '.ts'],
            alias: {
                '@app/common': path.join(__dirname, 'ClientApp', '@app/common'),
                '@app/controls': path.join(__dirname, 'ClientApp', '@app/controls')
            }
        },
        module: {
            rules: [
                { test: /\.css|\.html$/, use: 'raw-loader' },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=100000' },
                { test: /\.ts$/, include: /ClientApp/, loader: 'ts-loader' },
                { test: /\.(sa|sc)ss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] }
            ]
        },
        entry: {
            bundles: [
                './ClientApp/index.html',
                './ClientApp/boot.browser.ts',
                './ClientApp/styles/bootstrap-dashboard.scss'
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
            new CopyWebpackPlugin([
                { from: './ClientApp/index.html', to: '../index.html' }
            ]),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: env && env.prod ? '[name].[hash].css' : '[name].css',
                chunkFilename: env && env.prod ? '[id].[hash].css' : '[id].css',

            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            }),
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                // Remove this line if you prefer inline source maps
                filename: '[file].map',
                // Point sourcemap entries to the original file locations on disk
                moduleFilenameTemplate: path.relative('./wwwroot/dist', '[resourcePath]')
            })
        ],
        devServer: {
            contentBase: path.join(__dirname, 'wwwroot'),
            compress: true,
            port: 9000,
            watchOptions: {
                poll: true
            },
            watchContentBase: true,
            index: './index.htm',
            historyApiFallback: true
        }
    }];
};
