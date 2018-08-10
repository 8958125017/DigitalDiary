var adminSchema = require('../models/adminSchema');
var createAdmin = function(req, res){
	
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let email = req.body.email;
	let contactNo = req.body.contactNo;
	let address = req.body.address;
	let state = req.body.state;
	let pin     = req.body.pin;
	let country = req.body.country;
	let designation = req.body.designation;
	let department = req.body.department;
	let dob = req.body.dob;
	let doj = req.body.doj;
	let role = req.body.role;
	let image =req.body.image;

	if(firstName && lastName && email && contactNo){
		var adminModel = {
			firstName   : firstName,
			lastName    : lastName,
			email       : email,
			contactNo   : contactNo,
			address     : address,
			state       : state,
			pin         : pin,
			country     : country,
			designation : designation,
			department  : department,
			dob         : dob,
			doj         : doj,
			role        : role,
			image       : image
		}
		console.log("data ",adminModel);
		adminSchema.create(adminModel,(err,data)=>{
			if(err)return res.send({status:400,message:"Error ocured!",Error :err});
			return res.send({status:200,message:"Successfull created",data:data});
		})
	}else{
		return res.send({status:400,message:"Please fill all required field"});
	}
}

var getAdmin = function(req,res){
	adminSchema.find({},{},function(err,data){
		return res.send({status:200,message:"get admins",data:data});
	})
}

var getAdminById = function(req, res){
	adminSchema.findOne({_id : req.body.id},{firstName : 1},function(err, data){
		if(err)return res.send({status : 400, message :"error"});
		return res.send({status : 200, message :"Get admins", data : data});	
	});
}

var updateAdminById = function(req,res){
	console.log("req.body.id = = "+req.body.id);
	if(req.body.id &&req.body.firstName){
		adminSchema.update({_id:req.body.id},{$set : {firstName : req.body.firstName}},function(err,updateData){
		if(err) return res.send({status : 400, message :"error"});
		console.log("req.body.id = = "+err);
		return res.send({status:200,message:"Update Successfull!."});
	})
   }else{
   	    res.send({status : 400, message :"error"});
   }
	
}

var deleteAdminById=function(req,res){
	if(req.body.id){
		adminSchema.remove({_
			id : req.body.id},function(err,deleteData){
			console.log("err = = =",err,deleteData);
			if(err){
			return res.send({status:400,message:err});	
		} else{

			return res.send({status:200,message:"delete user successfully!.",data : deleteData})
		 }
		})
	}else{
		res.send({status:400,message:"something went wrong"});
	}
}


var postData = function(req, res){
	res.send({status : 200, message:  req.body,message1: req.params.id})
}

var postData1 = function(req, res){
	console.log(req.headers.name,req.headers.class);
	console.log(req.query.name);
	res.send({status : 200, message:  req.body,message1: req.params.id})
}

exports.createAdmin=createAdmin;
exports.getAdmin=getAdmin;
exports.getAdminById=getAdminById;
exports.postData1 = postData1;
exports.postData = postData;
exports.updateAdminById=updateAdminById;
exports.deleteAdminById=deleteAdminById;