const {validationResult} = require("express-validator");

module.exports = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let newErrors;
        newErrors = errors.array().map(err=>{
            return {key:err.param,message:err.msg}
        })
        return res.status(400).send({errors:newErrors});
    }
    next()
}