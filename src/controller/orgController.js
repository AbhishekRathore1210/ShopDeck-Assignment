const Organization = require('../models/organization');

const loadOrganization = async(req,res)=>{
    try {   
        res.render('create');
        
    } catch (error) {
        console.log(error.messsage);
    }
}
const created = async(req,res)=>{
    try{
        res.render('org');
    }catch(error){
        console.log(error.messsage);
    }
}

const createOrganization = async(res,req)=>{
    try{
        const org = new Organization({
            name:req.body.myName
        })

        const orgData = await org.save();
        if(orgData){
            console.log("Organizaton Created");
            res.render('org');
        }
        res.render('create');

    }catch(error){
        console.log(error.messsage);
    }
}

module.exports = {
    loadOrganization,
    createOrganization,
    created
}