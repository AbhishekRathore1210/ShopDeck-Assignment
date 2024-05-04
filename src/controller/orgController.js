const Organization = require('../models/organization');
const OrganizationUser = require('../models/organizationUser');

const loadOrganization = async (req, res) => {
    try {
        res.render('create');

    } catch (error) {
        console.log(error.messsage);
    }
}
const created = async (req, res) => {
    // let {firstname,lastname,email,dob,doj,organizationName} = req.body;
    const user = req.body;
    // console.log(user);
    try {
        const orgExist = await Organization.findOne({ name: user.organizationName });
        // console.log(orgExist);
        if (!orgExist) {
            console.log("Organization does not exists");
            return res.render('createOrgUserOwn',{
                isRegisterUser:false,
                isLogin:false,
                isOrganization:true,
                isAnother:false
            })
        }
        else {
            const userExist = await OrganizationUser.findOne({ email:user.email });
            console.log(userExist);
            if (userExist) {
                if (userExist.organization_list.includes(user.organizationName)) {
                    console.log("user is already a part of this organization");
                    return res.render('createOrgUserOwn', {
                        isRegisterUser: true,
                        isLogin:false,
                        isOrganization:false,
                        isAnother:false
                    })
                }
                else{
                    // const user1 = await OrganizationUser.findOne({email:req.body.email});
                    userExist.organization_list.push(req.body.organizationName);

                    await userExist.save();
                    return res.render('createOrgUserOwn',{
                        isRegisterUser: true,
                        isLogin:false,
                        isOrganization:false,
                        isAnother:false
                    })
                }
            }
                else {
                    // lets create a User
                    const new_user = await OrganizationUser.create({
                        first_name: user.firstname,
                        last_name: user.lastname,
                        email: user.email,
                        dob: user.dob,
                        doj: user.doj,
                        org:user.organizationName,
                        organization_list: [user.organizationName]
                    })
                    
                    await new_user.save();
                    orgExist.users.push({userId:new_user._id,name:`${new_user.first_name} ${new_user.last_name}`,email:new_user.email,is_verified:0});

                    await orgExist.save();
                    console.log("User is Registered Kindly Login");
                    return res.render('createOrgUserOwn',{
                        isRegisterUser:false,
                        isLogin:true,
                        isOrganization:false,
                        isAnother:false
                    })
                }
            }
        }catch (error) {
        console.log(error.messsage);
    }
}

const createOrganization = async (res, req) => {
    try {
        const org = new Organization({
            name: req.body.myName
        })

        const orgData = await org.save();
        if (orgData) {
            console.log("Organizaton Created");
            res.render('org');
        }
        res.render('create');

    } catch (error) {
        console.log(error.messsage);
    }
}

const createUser = async (req, res) => {
    try {
        return res.render('createOrgUserOwn', {
            isRegisterUser: false,
            isLogin:false,
            isOrganization:false,
            isAnother:false
        });
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadOrganization,
    createOrganization,
    created,
    createUser
}