const route = require("express").Router();
const User = require("../models/User");
const Token = require("../models/Token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload");
const { validateAccessToken, validateRefreshToken } = require("../middleware/index");

route.post("/info", validateAccessToken, async (req, res) =>{
    const id = req.user.id;
    const user = await User.findById(id);
    return res.json(user);
})

route.get("/profile/:id", async (req, res) => {
    const id = req.params.id;
    try{
        const user = await User.findById(id);
        return res.json({receiver:{username:user.username, profileImage:user.profileImage}});
    }
    catch(e){
        return res.status(404).json({"error":"User does not exist"});
    }
})

route.post("/profiles", async (req, res) => {
    const profileIds = req.body.profiles;
    let users = [];

    try{
        for(let i = 0; i < profileIds.length; i++){
            const user = await User.findById(profileIds[i]);
            users.push({username:user.username, profileImage:user.profileImage, id:user._id});
        }
        return res.json(users);
    }
    catch(e){
        return res.status(404).json({"error":"Please report this error to the admin"});
    }
})


route.post("/register", async (req, res) =>{
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.findOne({email:email});
    if(user){
        return res.status(401).json({"error":"The email is already registered", "user":user});
    }

    User.create({firstname:firstname, lastname:lastname, username:username, email:email, password:hash}, (err, user) =>{
        if(err){
            return res.status(401).json({"error":"The email is already registered"});
        }
        return res.status(200).json(user)
    })
})

route.post("/profilePic", upload.single("pic"), validateAccessToken, async (req, res) => {
    const id = req.user.id;
    const img = req.file.path;
    try{
        const response = await User.findByIdAndUpdate(id, {$set: {profileImage:img}});
        return res.redirect(process.env.CLIENT_SERVER);
    }
    catch(e){
        return res.status(401).json({"error":"Could not update profile image"});
    }
})

route.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;


    const user = await User.findOne({email : email});
    if(user){
        const validate = await bcrypt.compare(password, user.password);
        if(validate){
            const token = jwt.sign({id:user._id, username:user.username, email:user.email}, process.env.REFRESH_KEY);
            const tok = await Token.create({hash:token});
            return res.status(200).json({token:tok, user:user});
        }
        return res.status(401).json({"error":"Incorrect password"});
    }
    return res.status(401).json({"error":"User does not exist"});
})

route.get("/accessToken", validateRefreshToken, (req, res) => {
    const user = req.user;
    const token = jwt.sign(user, process.env.ACCESS_KEY, {expiresIn:1800});
    return res.json({accessToken:token});
})

module.exports = route;