const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    hash:{type:String}
})

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;