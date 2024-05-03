const express = require('express');
const dash_router = express();
const path = require('path');

dash_router.set('view engine','ejs');
dash_router.set('views','./views');

const dashController = require('../controller/dashController');

dash_router.get('/',dashController.loadDashboard);
dash_router.post('/',dashController.loadDashboard);
dash_router.get('/create',dashController.loadOrg);
dash_router.post('/createOrg',dashController.createOrg);
dash_router.get('/createOrgUser',dashController.loadOrgUser);
dash_router.post('/verifyOTP',dashController.verifyOTP);
dash_router.post('/createOrgUser',dashController.insertOrgUser);
dash_router.get('/delete-org',dashController.deleteOrg);


module.exports = dash_router;