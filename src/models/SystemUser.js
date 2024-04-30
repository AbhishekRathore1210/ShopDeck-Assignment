const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{ 
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        default:1
    },
    is_verified:{
        type:Number,
        default:0
    },
    otp:{
        type:String,
        default:'000000'
    }
})

const User = mongoose.model('User',userSchema);

module.exports = User;

