const express = require('express');
const org_router = express();
const path = require('path');

org_router.set('view engine','ejs');
org_router.set('views','./views');

const orgController = require('../controller/orgController');

org_router.get('/create',orgController.loadOrganization);
org_router.post('/orgCreated',orgController.createOrganization);
// org_router.get('/orgCreated',orgController.created);

const bodyParser = require('body-parser');
org_router.use(bodyParser.json());
org_router.use(bodyParser.urlencoded({extended:true}));

module.exports = org_router;


