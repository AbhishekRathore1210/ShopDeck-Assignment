const mongoose = require('mongoose')

const orgSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    users:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
        },
        is_verified:{
            type:Number,
            default:0
        }
    }]
})

const Organization = mongoose.model('Organization',orgSchema);

module.exports = Organization;