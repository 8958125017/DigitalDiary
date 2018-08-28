var mongoose = require('mongoose');
var Schema = mongoose.Schema;

adminSchema = new Schema({
		firstName   :   { type : String ,required : true },
		lastName    :   { type : String ,required : true },
		email       :   { type : String ,required : true,unique:true },
		password    :   { type : String ,required : true },	
		contactNo   :   { type : Number ,required : true },

		address     :   {
					      line1   :   { type : String },
					      line2   :   { type : String },
					      city    :   { type : String },
					      state   :   { type : String },
					      pin     :   { type : String },
					      country :   { type : String }
	   				    },	   

	  	designation :   { type : String },
		department  :   { type : String },
		dob         :   { type : String },
		doj         :   { type : String },
		role        :   { type : String },
		marks       :   { type : Number },
		isDeleted   :   { type : Boolean, default :false },
		image       :   { type : String,default  :'' },
		createdAt   :   { type : Date, default:Date.now }
})

var admin = mongoose.model('admin',adminSchema);

module.exports=admin;