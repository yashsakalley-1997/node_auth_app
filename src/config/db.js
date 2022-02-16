const mongoose = require("mongoose");
const connect = () =>{
    return mongoose.connect(
        "mongodb+srv://yash:yash_123@cluster0.zvavu.mongodb.net/masai_school"
    );
};


module.exports = connect;
