const path = require("path"); 
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode:"production",
    entry:"./src/index.js",
    devtool:"source-map",
    output:{
        path:path.resolve(__dirname, "build"),
        publicPath:"/build/",
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
                test:/\.scss$/,
                use:[MiniCssExtractPlugin.loader,"css-loader", "sass-loader"]
            },
            {
                test:/\.(png|jpg|jpeg|svg)$/i,
                type:"assert/resource"
            }
        ]
    },
    resolve:{
        extensions:["*", ".js", ".jsx"]
    },
    plugins:[new MiniCssExtractPlugin(), new htmlWebpackPlugin({
        filename:"index.html",
        template:"public/index.html"
    })]
}