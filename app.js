var express=require('express');
var bodyparser=require('body-parser');
var http=require('http');
var cors = require('cors');
var app=express();
var adminRoute = require('./app/routes/admin/adminRoute.js');
var db = require('./app/config/dbconnection');

var PORT = 4008;

// Simple Usage (Enable All CORS Requests)
app.use(cors());

app.use(bodyparser({limit: '50mb'}));
// support parsing of application/json type post data
app.use(bodyparser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyparser.urlencoded({extended: true}));




// it is used for  connect server with http

var server = http.createServer(app);
server.listen(process.env.PORT ||  PORT);

server.on('error',function onError(err){
	console.log("err ",err);
});

server.on('listening',function onListen(){
	console.log("server created :  :");
	db.connectDB();
});


// it is used for local system  without http

// app.listen(PORT,function(err,data){
// 	console.log(`server running on  ${PORT}`);
// 	db.connectDB();
// });

// app.get('/',function(req, res){
// 	res.send({status :200,message:"Welcome to the first app deploy"});
// })



app.use('/admin',adminRoute);