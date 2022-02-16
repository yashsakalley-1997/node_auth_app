require("dotenv").config()
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const newToken = (user) => {
    return jwt.sign({user},process.env.JWT_SECRET_KEY);
};

const register = async (req,res)=>{
    try{
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).send({err:"Entered mail id already exists"})
        }
        user = await User.create(req.body);
        const token = newToken(user);
        return res.status(200).send({user,token})
    }
    catch(err){
        return res.status(500).send({err:err.message})
    }
}

const login = async (req,res)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send({err:"Incorrect credentials"})
    }
    const match = user.checkPassword(req.body.password);
    if(!match){
        return res.status(400).send({err:"Incorrect credentials"})   
    }

    const token = newToken(user);
    res.send({user,token})
}

module.exports = {register,login,newToken};
