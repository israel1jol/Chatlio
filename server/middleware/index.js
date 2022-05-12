const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

const validateRefreshToken = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const tok = await Token.findOne({hash:token});
    if(tok){
        try{
            const payload = jwt.verify(token, process.env.REFRESH_KEY);
            req.user = payload;
            next();
        }
        catch(e){
            return res.status(401).json({"error":"Invalid refresh token"});
        }
    }
    else{
        return res.status(401).json({"error":"Invalid refresh token"});
    }
}

const validateAccessToken = async (req, res, next) => {
    const token = req.body.token;
    try{
        const payload = jwt.verify(token, process.env.ACCESS_KEY);
        req.user = payload;
        next();
    }
    catch(e){
        return res.status(401).json({"error":"Invalid access token"});
    }

}

module.exports = { validateAccessToken, validateRefreshToken }