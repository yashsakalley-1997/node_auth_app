const express = require("express");
const path = require('path');
const app = express();
const connect = require("./config/db")
const validate = require("./middlewares/validate");
const {body} = require("express-validator");
const passport = require("./config/google_oauth");

const port = 5000;
// Importing the controllers.
const {register,login,newToken} = require("./controllers/user_auth.controller");
const post = require("./controllers/product.controller");

app.use(express.json());
app.post("/register",
body("email").isEmail().withMessage("Not a valid email"),
body("password").notEmpty().withMessage("Password cannot be empty"),
validate,register);

app.post("/login",
body("email").isEmail().withMessage("Not a valid email"),
body("password").notEmpty().withMessage("Password cannot be empty"),
validate,login);

app.use("/products",post)

passport.serializeUser(function(user,done){
    done(null,user)
})

passport.deserializeUser(function(user,done){
    done(null,user)
})
app.get('/auth/google',
  passport.authenticate('google', { scope:
  	[ 'email', 'profile' ] }
));
 
app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        failureRedirect: '/auth/google/failure'
}),(req,res)=>{
        const token = newToken(req.user);
        res.send({user:req.user,token});
});

// Turning on the server and connecting with the db.
app.listen(port,async ()=>{
    try{
        await connect()
        console.log("Listening on "+port)
    }
    catch(err){
        console.log(err.message)
    }
})