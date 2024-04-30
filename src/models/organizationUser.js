const mongoose = require('mongoose')

const orgUserSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    is_admin:{
        type:Number,
        default:0
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    doj:{
        type:String,
        required:true
    },
    org:{
        type:String,
        required:true
    },
    organization_list:{
        type:Array,
        default:[],
        required:true
    }
})

const OrganizationUser = mongoose.model('OrganizationUser',orgUserSchema);

module.exports = OrganizationUser;