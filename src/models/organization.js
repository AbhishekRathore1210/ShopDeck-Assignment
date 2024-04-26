const mongoose = require('mongoose')

const orgSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

const Organization = mongoose.model('Organization',orgSchema);

module.exports = Organization;