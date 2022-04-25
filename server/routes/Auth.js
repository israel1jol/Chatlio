const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");



router.post("/register", async (req, res) =>{
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    User.create({firstname, lastname, username, email, hash}, (err, user) =>{
        if(err){
            return res.status(401).json({"Error":err});
        }
        return res.status(200).json(user)
    })
})

module.exports = router;