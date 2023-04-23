const path = require("path");

module.exports = {
    mode:"production",
    entry:"./index",
    output:{
        path:path.resolve(__dirname, "dist"),
        publicPath:"/dist/",
        filename:"build.js"
    },
    resolve:{
        extensions:[".* ",".js", ".ts",]
    }
}