const Organization = require('../models/organization');
const User = require('../models/SystemUser');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const OrganizationUser = require('../models/organizationUser');

const generateOTP = ()=>{
    const OTP  = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        specialChars:false
    })
    return OTP;
}
const loadRegister = async(req,res)=>{
    try{
        return res.render('register');

    }catch(error){
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

const homePage = async(req,res)=>{
    try {
        return res.render('home');
    } catch (error) {
        console.log(err.message);
    }
}

const sendEmailOTP = async(email,id)=>{
    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'abhishek19229785@gmail.com',
                pass:''
            }
        });
        // console.log(email);

        const myOtp = generateOTP();
        
        const mailOptions = {
            from:'abhishek19229785@gmail.com',
            to:email,
            subject:'For Verification Mail',
            text:`Your otp is ${myOtp}`
        }
        transporter.sendMail(mailOptions,function(err,info){
            if(err){
                console.log(err);
            }
            else{
                console.log("Mail sent succesfully",info.response);
            }
        });

        return myOtp;
    } catch (error) {
        console.log(error.message);
    }
}
const insertUser = async(req,res)=>{

    try{
        const user = new User({
            name:req.body.name,
            email:req.body.myEmail
        })

        const userData =  await user.save();
        if(userData){
            const myOtp = await sendEmailOTP(req.body.myEmail,userData._id);
            const updatedOtp = await User.updateOne({_id:userData._id},{$set:{otp:myOtp}});
            // console.log(updateOtp);
            return res.render('otp');
        }
        return res.render('register');
    }
    catch(error){
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
        console.log("inside if");
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
        return res.status(201).json({status: "true", msg: "Organization User created sucessfully"})
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

const verifyEmail = async(req,res)=>{
    try {
        const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_verified : 1}});
        console.log(updateInfo);
        res.render('home');

    } catch (error) {
        console.log(error.message);
    }
}

const createOrg = async(req,res)=>{
    try{
        // console.log(req.body.myName);
        const org = new Organization({
            name:req.body.myName
        })

        const orgData = await org.save();
        if(orgData){
            return res.render('org');
        }
        res.render('create');

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    homePage,
    verifyEmail,
    createOrg,
    loadOrgUser,
    insertOrgUser
}