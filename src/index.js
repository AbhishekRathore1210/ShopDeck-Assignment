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
app.get('/register',userRoute);
app.get('/',userRoute);
app.post('/otp',userRoute);
app.get('/verify',userRoute);

app.get('/create',orgRoute);
app.get('/createOrgUser',userRoute);
app.post('/createOrgUser',userRoute);
app.post('/org',userRoute);



app.listen(port,function(err){
    if(err){
        console.log('error',err);
        return;
    }
    console.log("Server is running on port "+ port);
})