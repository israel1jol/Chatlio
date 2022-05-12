const webpack = require("webpack");
const path = require("path"); 

module.exports = {
    mode:"development",
    entry:"./src/index.js",
    output:{
        path:path.resolve(__dirname, "dist"),
        publicPath:"/dist/",
        filename:"main.js",
        assetModuleFilename:"[name][ext]"
    },
    module:{
        rules:[
            {
                test:/\.(js|jsx)$/,
                exclude:/node_modules/,
                loader:"babel-loader",
                options:{
                    presets:["@babel/preset-env", "@babel/preset-react"]
                }
            },
            {
                test:/\.(scss|css)$/,
                use:["style-loader","css-loader", "sass-loader"]
            },
            {
                test:/\.(png|jpg|jpeg|svg)$/,
                type:"assert/resource"
            }
        ]
    },
    resolve:{
        extensions:["*", ".js", ".jsx"]
    },
    devServer:{
        port:3000,
        historyApiFallback:true,
        host:"localhost"
    },
    plugins:[new webpack.HotModuleReplacementPlugin()]
}