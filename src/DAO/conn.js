const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/user_db');

const db = mongoose.connection;

//error
db.on('error',console.error.bind(console,'error connecting to db'));

// up and running
db.once('open',function(){
    console.log("Successfully connected to the database");
})

module.exports = db;