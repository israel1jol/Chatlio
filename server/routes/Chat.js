const route = require("express").Router();
const Room = require("../models/Room");
const User = require("../models/User");
const { validateAccessToken } = require("../middleware/index");
const {mailNewChatMessage} = require("../middleware/mailer");

route.post("/roomData/:secondId", validateAccessToken, async (req, res) => {
    try{
        const id = req.user.id;
        const Id = req.params.secondId;
        const accesser_request = await Room.findOne({firstUserId:id, secondUserId:Id})
        if(accesser_request){
            return res.json({response:"Room Found", room:accesser_request, userId:id});
        }
        const receiver_request = await Room.findOne({firstUserId:Id, secondUserId:id});
        if(receiver_request){
            return res.json({response:"Room Found",room:receiver_request, userId:id});
        }
        const room = await Room.create({firstUserId:id, secondUserId:Id});
        const secondUser = await User.findById(Id);
        mailNewChatMessage(req.user, secondUser);
        return res.status(200).json({response:"Room Created", room:room, userId:id});
    }
    catch(e){
        return res.json({"error":"Something went wrong on our end. Sorry!", "msg":e.message})
    }
})

route.post("/recentChats", validateAccessToken, async (req, res) => {
    try{
        const id = req.user.id;
        const started_rooms = await Room.find({firstUserId:id})
        const joined_rooms = await Room.find({secondUserId:id})
        const recent_chats =started_rooms.map(rooms => rooms.secondUserId)
        joined_rooms.forEach(rooms => recent_chats.push(rooms.firstUserId))
        return res.json(recent_chats);
    }
    catch(e){
        return res.json({"error":"Something went wrong on our end. Sorry!", "msg":e.message})
    }
})

module.exports = route;