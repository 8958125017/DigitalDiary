var mongoose = require('mongoose');
var constant = require('./constant');

function connectDB(){
	//console.log('DB url is',constant.DBURL);
	mongoose.connect("mongodb://localhost:27017/digital_diary", function(err,data){
		console.log("connection sucess");
	});
}

var obj = {
	connectDB : connectDB
}

module.exports = obj;