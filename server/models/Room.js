const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    firstUserId:{type:String},
    secondUserId:{type:String}
})

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;