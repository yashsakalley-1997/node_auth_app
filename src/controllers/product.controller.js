const express = require("express");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const validate = require("../middlewares/validate");

const router = express.Router();
const {body,validationResult} = require('express-validator');

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.post("",body("authorized_person").isMongoId().bail().custom(async (value)=>{
    const user = await User.findById(value).lean().exec();
    let allowed_users = ["admin","seller"];
    if(!allowed_users.includes(user.roles[0])){
        throw new Error("Entered user not allowed")
    }
    return true
}),validate,authenticate,async (req,res)=>{
    try{
        const user_id = req.user._id;
        const product = await Product.create({
            title:req.body.title,
            price:req.body.price,
            authorized_person:user_id
        });
        return res.status(200).send(product);
    }
    catch(err){
        return res.status(500).send({err:err.message})
    }
})


router.get("/:id",authenticate,async (req,res)=>{
    try{
        const products = await Product.find({user:req.params.id}).lean().exec();
        return res.status(200).send(products);
    }
    catch(err){
        return res.status(500).send({err:err.message})
    }
})

// Update.
router.patch("/:id",authenticate,authorize(["seller","admin"]),async (req,res)=>{
    try{
        const updated_product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true
        })
        return res.status(200).send(updated_product)
    }
    catch(err){
        return res.status(500).send({err:err.message})
    }
})
// Delete.
router.delete("/:id",authenticate,async (req,res)=>{
    try{
        const product = await Product.deleteMany({_id:req.params.id}).lean().exec()
        return res.status(200).send(product)
    }
    catch(err){
        return res.status(500).send({err:err.message})
    }
})

module.exports = router;
