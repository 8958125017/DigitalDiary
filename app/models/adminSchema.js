var mongoose = require('mongoose');
var Schema = mongoose.Schema;

adminSchema = new Schema({
	firstName   : { type : String ,required : true},
	lastName    : { type : String ,required : true},
	email       : { type : String ,required : true,unique:true},	
	contactNo   : { type : Number ,required : true,unique:true},
	address     : { type : String },
	state       : { type : String },
   	pin         : { type : Number },
   	country     : { type : String },
  	designation : { type : String },
	department  : { type : String },
	dob         : { type : String },
	doj         : { type : String },
	role        : { type : String },
	image       : { type : String,default:String},
	createdAt   : { type : Date, default:Date.now}

})

var admin = mongoose.model('admin',adminSchema);

module.exports=admin;