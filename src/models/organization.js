const mongoose = require('mongoose')

const orgSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    userEmail:{
        type:Array,
        required:true
    }
})

const Organization = mongoose.model('Organization',orgSchema);

module.exports = Organization;