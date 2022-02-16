const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

require('dotenv').config()

const verifyToken = (token) =>{
    return new Promise((resolve,reject)=>{
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
            if(err){
                return reject(err)
            }
            else{
                resolve(user);
            }
        })
    })
}

module.exports = async (req,res,next) =>{
    
    if(!req.headers.authorization){
        return res.status(400).send({err:"Not Authorized"})
    }

    if(!req.headers.authorization.startsWith("Bearer")){
        return res.status(400).send({err:"Not Authorized"})
    }

    const token = req.headers.authorization.split(" ")[1];
    let user;
    try{
        user = await verifyToken(token);
        req.user = user.user;
    }
    catch(err){
        return res.status(400).send({err:"Not Authorized"})
    }
    return next();
}