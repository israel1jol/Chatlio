const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    firstname:{type:String},
    lastname:{type:String},
    username:{type:String},
    email:{type:String, unique:true},
    password:{type:String},
    profileImage:{type:String, default:""}

}, {timestamps:true})

const User = mongoose.model("User", UserSchema);

module.exports = User;