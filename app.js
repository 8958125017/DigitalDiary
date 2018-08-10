var express=require('express');
var bodyparser=require('body-parser');
var app=express();
var adminRoute = require('./app/routes/admin/adminRoute.js');
var db = require('./app/config/dbconnection');

var PORT = 4000;

app.use(bodyparser.json());
app.listen(PORT,function(err,data){
	console.log(`server running on  ${PORT}`);
	db.connectDB();
});


app.use('/admin',adminRoute);