// 引入path包
const path = require('path')
const HTMLWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

// webpack中所有配置信息都应写在exports
module.exports = {
    // 指定入口文件
    entry: "./src/index.ts",
    // 指定编译输出
    output: {
        // 编译输出目录
        path: path.resolve(__dirname,"dist"),
        // 打包后合并为一个文件
        filename: "bundle.js",
        environment: {
            // 使用 babel 可以将ts中 箭头函数转换为ie也能执行的function(),
            // 但bundle.js开头的(()=>...) 是webpack生成的，babel无法修改，因此要控制不使用箭头函数，需要再此处配置
            arrowFunction: false,
            // 不使用 const 在IE10不支持
            const: false,
        }
    },
    // webpack打包需要依赖的模块
    module: {
        rules: [
            {
                // 指定规则生效文件，此处是值.ts结尾文件
                test: /\.ts$/,
                // 打包使用ts-loader插件
                use:[
                    // 复杂方式配置babel加载器
                    {
                        loader: "babel-loader",
                        options: {
                            presets:[
                                [
                                    "@babel/preset-env",
                                    {
                                        // 要兼容目标浏览器
                                        targets:{
                                            "chrome":"88",
                                            "ie":"11",
                                        },
                                        // 指定corejs 版本
                                        "corejs":"3",
                                        // 按需加载
                                        "useBuiltIns":"usage"
                                    }
                                ]
                            ]
                        }
                    },
                    'ts-loader', // 从后往前执行（第一个执行）
                ],
                // 打包排除文件
                exclude: /node_modules/
            },
            {
                test: /.\.less$/,
                use:[
                    "style-loader",
                    "css-loader",
                    // 引入 post-css
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions:{
                                plugins: [
                                    [
                                        "postcss-preset-env",
                                        {
                                            browsers: "last 2 versions"
                                        }
                                    ]
                                ]
                            }
                        }
                    },
                    "less-loader", // 先执行
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            // title:"自定义html标题"
            template: "./src/template.html"
        }),
    ],
    resolve: {
        extensions: [".ts",".js"]
    },
}


