const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{type:String,required:true},
    price:{type:Number,required:true},
    authorized_person:{type:mongoose.Schema.Types.ObjectId,ref:"auth_user"}
},{
    timestamps:true,
    versionKey:false
})


module.exports = mongoose.model("products",postSchema);