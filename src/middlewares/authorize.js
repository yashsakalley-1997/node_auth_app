const Product = require("../models/product.model");

module.exports  =  function(permittedRoles){
    return async function(req,res,next){
        const user = req.user;
        let isPermitted = false;
        let ifUser = false;
        let product = await Product.findById(req.params.id).lean().exec();
        if(req.user._id == product.authorized_person){
            ifUser = true;
        }
        permittedRoles.forEach(element => {
            if(user.roles.includes(element)){
                isPermitted = true
            }
        })
        if(!isPermitted || !ifUser){
            return res.status(403).send({message:"Permission Denied"})
        }
        return next();
    }
}