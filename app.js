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

app.get('/',function(req, res){
	res.send({status :200. message:"Welcome to the first app deploy"});
})

app.use('/admin',adminRoute);