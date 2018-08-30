var mongoose = require('mongoose');
var constant = require('./constant');

function connectDB(){
	//console.log('DB url is',constant.DBURL);
	





	var mongoDb_URL="mongodb://pankaj1992:Pankaj*123@ds137862.mlab.com:37862/digital_diary"

	mongoose.connect(mongoDb_URL, function(err,data){
		console.log("connection sucess");
	});
}

var obj = {
	connectDB : connectDB
}

module.exports = obj;