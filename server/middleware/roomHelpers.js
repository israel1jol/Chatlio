const jwt = require("jsonwebtoken");
const Message = require("../models/Message");


const storeMessage = async (token, data) => {
    try{
        const payload = jwt.verify(token, process.env.ACCESS_KEY);
        const msg = await Message.create({text:data.text, roomId:data.roomId, userId:data.userId});
        return {error:false, message:msg};
    }
    catch(e){
        return {error:"Token has expired", message:null};
    }
}

const getMessages = async (roomId) => {
    try{
        const messages = await Message.find({roomId:roomId});
        return {error:false, response:messages};
    }
    catch(e){
        return {error:true, response:"The server is having trouble saving your message"}
    }
}


module.exports = { storeMessage, getMessages };