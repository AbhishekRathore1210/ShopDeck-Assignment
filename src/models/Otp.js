const mongoose = require('mongoose');

const OtpSchema = mongoose.Schema({
    email:{
        type:String,
    },
    otp:{
        type:String,
        default:'000000'
    }
})

const Otp = mongoose.model('Otp',OtpSchema);

module.exports = Otp;