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
        return res.render('register',{
            isRegister:false
        });

    }catch(error){
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
        const user1 =  await User.findOne({email:req.body.myEmail});
        console.log(user1);
        if(user1){
            console.log("user is already present");
            res.render('register',{
                isRegister:true
            });
        }
        else{
        const user = new User({
            name:req.body.name,
            email:req.body.myEmail
        })

        const userData =  await user.save();
        if(userData){
            const myOtp = await sendEmailOTP(req.body.myEmail,userData._id);
            const updatedOtp = await User.updateOne({_id:userData._id},{$set:{otp:myOtp}});
            // console.log(updateOtp);
            return res.render('login');
        }
        return res.render('register');
    }
}
    catch(error){
        console.log(error.message);
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

const check = async(otp,email)=>{
    const user = await User.findOne({email:email});
    console.log(user);
    if(user){
        if(user.otp === otp){
            return true;
        }
        return false;
    }
    return false;
}
const verifyOTP = async(req,res)=>{
    try {
        myotp = req.body.newOtp;
        email = req.body.myEmail;
        console.log("myOtp " , myotp);

        if(check(myotp,email)){

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
        res.render('home');
    }
}
     catch (error) {
        console.log(error.message);
    }
}

const loadLogin2 = async(req,res)=>{
    try{
        return res.render('login2',{
            isVerified:true
        });
    }catch(error){
        console.log(error.message);
    }
}

const loginUser = async(req,res)=>{
    try{
        const email = req.body.email;
        // console.log(email);
        const user_1 = await User.findOne({
            $and:[{email:email},{is_verified:1}]
        });
        // console.log(user_1);
        if(user_1){
            Organization.find({}).then((cnt)=>{
                return res.render('dashboard',{
                    title:"DashBoard",
                    org_list:cnt
                })}).catch((err)=>{
                    console.log(err);
                })
        }
        else{
            return res.render('login2',{
                isVerified:false
            })
        }
    }catch(error){
        console.log(error.message);
    }
}


module.exports = {
    loadRegister,
    insertUser,
    homePage,
    verifyEmail,
    verifyOTP,
    loadLogin2,
    loginUser
}