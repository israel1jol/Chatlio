const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    text:{type:String},
    userId:{type:String},
    roomId:{type:String}
}, {timestamps:true})

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;