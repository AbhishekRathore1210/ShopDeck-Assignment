const express = require('express');
const app = express();
const port = 7000;
const path = require('path');

const db = require('./DAO/conn');
const User = require('./models/SystemUser');
// const routes = require('./routes/userRoutes');
const organization = require('./models/organization');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));

const userRoute = require('./routes/userRoutes');
const orgRoute = require('./routes/orgRoutes');
const dashboardRoute = require('./routes/dashboardRoute');
app.get('/register',userRoute);
app.get('/',userRoute);
app.post('/login',userRoute);
app.get('/verify',userRoute);


app.get('/createOrgUser',userRoute);
app.post('/createOrgUser',userRoute);
app.get('/login2',userRoute);
app.post('/dashboard',userRoute);


//dashboard routes
app.use('/dashboard',dashboardRoute);


app.listen(port,function(err){
    if(err){
        console.log('error',err);
        return;
    }
    console.log("Server is running on port "+ port);
})