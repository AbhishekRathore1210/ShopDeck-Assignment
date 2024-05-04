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
        const updateInfo = await User.updateOne({email:email},{$set:{is_verified : 1}});
        // console.log(updateInfo);
        
        return res.redirect('/dashboard');
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
            return res.redirect('/dashboard');
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
    // console.log(req.body);
    const {firstname,lastname,email,dob,doj,organize} = req.body;
    // console.log(req.body);
    try{
        const existingUser = await OrganizationUser.findOne({email:email});
        if(existingUser){
            if(existingUser.organization_list.includes(organize)){
                return res.status(404).send({ message: "User already exists in the organization." });
            }
            else{
                const existingDepartment = await Organization.findOne({name:organize });
                if(!existingDepartment){
                    return res.status(404).send({ message: "No such department exists." });
                }
                existingUser.organization_list.push(organize);
                await existingUser.save();

                existingDepartment.users.push({ userId: existingUser._id, name: `${firstname} ${lastname}`, email: email, is_verified: 0 });
        await existingDepartment.save();

        // return res.status(200).send({  message: "User added to another organization." });
        console.log("User added to another organization");
        return res.redirect('back');
            }
        }

        let department = await Organization.findOne({name:organize });

    if (!department) {
      return res.status(404).send({ message: "No such department exists." });
    }

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

            }catch(error){
            console.log(error.message);
        }
    }
const deleteOrg = async(req,res)=>{
    try{
        let id = req.query.id;
        const updateInfo = Organization.findByIdAndDelete(id).catch((err)=>console.log(err));
        res.redirect('back');

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    createOrg,
    verifyOTP,
    loadDashboard,
    loadOrg,
    insertOrgUser,
    loadOrgUser,
    deleteOrg
}
