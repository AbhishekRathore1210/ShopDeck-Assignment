const express = require('express');
const user_router = express();
const path = require('path');

user_router.set('view engine','ejs');
user_router.set('views','./views');

const userController = require('../controller/userController');

user_router.get('/',userController.homePage);

user_router.get('/register',userController.loadRegister);

user_router.post('/login',userController.insertUser);

user_router.get('/login2',userController.loadLogin2);

user_router.get('/verify',userController.verifyEmail);

user_router.post('/dashboard',userController.loginUser);




const bodyParser = require('body-parser');
user_router.use(bodyParser.json());
user_router.use(bodyParser.urlencoded({extended:true}));

module.exports = user_router;



