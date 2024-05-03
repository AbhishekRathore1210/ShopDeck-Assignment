const Organization = require('../models/organization');
const User = require('../models/SystemUser');
const OrganizationUser = require('../models/organizationUser');


const check = async(otp,email)=>{
    const user = await User.findOne({email:email});
    console.log(otp);
    console.log(user);
    // console.log(user.otp);
    if(user){
        if(user.otp == otp){
            return true;
        }
        console.log("otp failed");
        return false;
    }
    return false;
}

const verifyOTP = async(req,res)=>{
    try {
        myotp = req.body.newOtp;
        email = req.body.myEmail;

        const flag = await check(myotp,email);
        if(flag){
            console.log("Inside if");
        const updateInfo = await User.updateOne({email:email},{$set:{is_verified : 1}});
        // console.log(updateInfo);
        
        Organization.find({}).then((cnt)=>{
            return res.render('dashboard',{
                title:"DashBoard",
                org_list:cnt
            })}).catch((err)=>{
                console.log(err);
            })
    }
    else{
        console.log("OTP is not correct");
        return res.render('login');
    }
}
     catch (error) {
        console.log(error.message);
    }
}

const createOrg = async(req,res)=>{
    try{
        const org = new Organization({
            name:req.body.myName
        })
        const orgData = await org.save();
        if(orgData){
            Organization.find({}).then((cnt)=>{
                return res.render('dashboard',{
                    title:"DashBoard",
                    org_list:cnt
                })}).catch((err)=>{
                    console.log(err);
                })
        }
        else{
            return res.render('create');
        }

    }catch(error){
        console.log(error.message);
    }
}

const loadOrg = async(req,res)=>{
    try{
        return res.render('create');
    }catch(error){
        console.log(error.message);
    }
}

const loadDashboard = async(req,res)=>{
    try {
        Organization.find({}).then((cnt)=>{
            return res.render('dashboard',{
                title:"DashBoard",
                org_list:cnt
            })}).catch((err)=>{
                console.log(err);
            })
    } catch (error) {
        console.log(error.message);
    }
}

const loadOrgUser = async(req,res)=>{
    try {
        return res.render('createOrgUser');
    } catch (error) {
        console.log(error.message);
    }
}

const insertOrgUser = async(req,res)=>{
    console.log(req.body);
    let {firstname,lastname,email,dob,doj,organize} = req.body;

    if(
        [organize, firstname, email, dob, doj].some((el)=>{
            return el === "" || typeof(el) === 'undefined'
        })
    ){
        return res.status(201).json({status: "false", msg: "Fill the details"})
    }

    let orgData = await Organization.findOne({name: organize})
    if(!orgData){
        return res.status(201).json({status: "false", msg: "Organization not exists"})
    }
    else if(orgData.userEmail.includes(email)){
        return res.status(201).json({status: "true", msg: "Email ID already exists"})
    }
    else{
        const ack = await Organization.updateOne(
            {name: organize},
            {
                $push:{
                    userEmail: email,
                }
            }
        )
    }
    let userData = await OrganizationUser.findOne({email: email})
    if(!userData){
        const new_user = await OrganizationUser.create({
            first_name: firstname,
            last_name: lastname,
            email: email,
            dob: dob,
            doj: doj,
            org:organize,
            organization_list: [organize]
        })
        new_user.save()
        Organization.find({}).then((cnt)=>{
            return res.render('dashboard',{
                title:"DashBoard",
                org_list:cnt
            })}).catch((err)=>{
                console.log(err);
            })
    }
    else{
        console.log("inside else");
        await OrganizationUser.updateOne(
            {email : email},
            {
                $push: {
                    organization_list: organize
                }
            }
        )

        return res.status(201).json({status: "true", msg: "Organization User added sucessfully"})
    }
}

module.exports = {
    createOrg,
    verifyOTP,
    loadDashboard,
    loadOrg,
    insertOrgUser,
    loadOrgUser
}
