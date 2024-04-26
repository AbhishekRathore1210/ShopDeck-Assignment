const Organization = require('../models/organization');
const User = require('../models/SystemUser');
const nodemailer = require('nodemailer');

const loadRegister = async(req,res)=>{
    try{
        return res.render('register');

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
        const mailOptions = {
            from:'abhishek19229785@gmail.com',
            to:email,
            subject:'For Verification Mail',
            html:'<p>Click here to<a href = "http://127.0.0.1:7000/verify?id='+id+'"> Verify </a> </p>'
        }
        transporter.sendMail(mailOptions,function(err,info){
            if(err){
                console.log(err);
            }
            else{
                console.log("Mail sent succesfully",info.response);
            }
        });
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
            sendEmailOTP(req.body.myEmail,userData._id);
            return res.render('otp');
        }
        return res.render('register');
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
    createOrg
}