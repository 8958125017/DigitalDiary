var adminSchema    =  require('../models/adminSchema');
var CONST          =  require('../config/constant');
var GlobalMessages =  require('../config/constantMessage');
var bcrypt         =  require('bcrypt');
var nodemailer     =  require('nodemailer');
var jwt            =  require('jsonwebtoken');
var cloudinary     =  require('cloudinary');
var fs             =  require('fs');
var request        =  require('request');
var async          =  require('async');
// twillo

const accountSid   =  CONST.twilioObj.accountSid;
const authToken    =  CONST.twilioObj.authToken;
const twilloNum    =  CONST.twilioObj.twilloNum;

const client       = require('twilio')(accountSid, authToken);

// email

const fromEmail    =  CONST.emailObj.email;
const fromPass     =  CONST.emailObj.password;

// Image upload

const cloud_name   = CONST.imageUploadObj.cloud_name;
const api_key      = CONST.imageUploadObj.api_key;
const api_secret   = CONST.imageUploadObj.api_secret;


// get data from third party

var getThirdPartyData = function(req, res){
	request('https://cex.io/api/currency_limits',function(err, response,body){
		if(err) return res.send({status:400,message:"Error while fetching data from server!."});
		return res.send({status:400,body : JSON.parse(body).data.pairs});
	});
}

var getAdminByPageNo = function(req, res){
	let skipVal = ((3* req.body.pageNo) - 3);

	adminSchema.find({}, {}).count().exec(function (err, data) {
       if (err) {
           res.send({err: err.message , status: 400});
       } else {
           if(data) {
               adminSchema.find({},{}).sort({ createdAt: -1 })
               .skip(skipVal)
               .limit(3)
               .exec(function(err, result){
                   if(err){
                       res.send({msg: err.message, status: 400});
                   }else{
                       res.send({status:200, totalRecords: data, data: result});
                   }
               });
           }
           else{
              return res.send({status : 400, message:'send me'});
           }
       }
   });
}

// send message to phone number 

var sendMessage = function(req,res){
	let mobileNumber = req.body.number;
	console.log('Number',mobileNumber);
	client.messages
      .create({from: twilloNum, body: 'Hello testing', to: mobileNumber})
      .then(message => 
      	{
      		return res.send({status:200,message:"Message sent Successfull",data:message});
      		console.log(message.sid);
      	})
      .done();
}

// for send mail to email

function sendEmail(toEmail){
	var serviceEmail = nodemailer.createTransport({
		service :'gmail',
		auth : {
			user : fromEmail,
			pass : fromPass
		}
	});
	var postParama = {
		   from     :  fromEmail,
		   to       :  toEmail,
		   subject  : 'Hello',
		   text     : 'hello testing'
	};
	console.log(postParama);
	serviceEmail.sendMail(postParama,function(err, info){
    console.log('email send :::',info);
	})
}

// send email and password after sign up

function sendEmailTo(toemail,password){
	var serviceEmail = nodemailer.createTransport({
		service :'gmail',
		auth    : {
                    user : fromEmail,
                    pass : fromPass
		}
	});
	var postParama = {
		from    : fromEmail,
		to      : toemail,
		subject : 'DigitalDiary credentials',
		html    : `<hr><h3>UserName :${toemail}</h3><br/><h3>Password : ${password}</h3><br/></br/>
		           <P>Thank You </p></br>
		           Digital Diary`
	};
	console.log(postParama);
	serviceEmail.sendMail(postParama,function(err,info){
		console.log('err :  :',err);
		console.log('email send successfully :  :',info);
	})
}

// create admin  signup

var createAdmin = function(req, res){
	
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let email = req.body.email;
	let password = req.body.password;
	let contactNo = req.body.contactNo;
	let address = req.body.address;
	let designation = req.body.designation;
	let department = req.body.department;
	let dob = req.body.dob;
	let doj = req.body.doj;
	let role = req.body.role;
	let marks = req.body.marks;
	let image =req.body.image;

	if(!firstName || !lastName || !email || !password || !contactNo){
       return res.send({status:400,message:"Please fill all required field"});
	}else{
		adminSchema.findOne({email:email.toLowerCase()},{},function(err,data){
			if (err) {
				return res.send({status : 400,message:err})
			}else if (data){
                return res.send({status:400,message : "email id allready exit"});
			}else{
				bcrypt.hash(password,10,function(err,hash){
		       	if(err) return res.send({status:400,message:'Error in hash'});
				   console.log('err::',err);
				   console.log('encrypted hash::',hash);
		       	   var adminModel = {
						firstName         : firstName,
						lastName          : lastName,
						email             : email,
						password          : hash,
						contactNo         : contactNo,
						'address.line1'   : address.line1,
						'address.line2'   : address.line2,
						'address.state'   : address.state,
						'address.city'   : address.city,
						'address.pin'     : address.pin,
						'address.country' : address.country,
						designation       : designation,
						department        : department,
						dob               : dob,
						doj               : doj,
						role              : role,
						marks             : marks,
						image             : image,
						isDeleted         : false
				}		
				adminSchema.create(adminModel,(err,data)=>{
					console.log("err = ="+err);
					if(err)return res.send({status:400,message:"Error ocured!",Error :err});		    
					sendEmailTo(email,password);
					return res.send({status:200,message:"Successfull created",data:data});
				})
       });
			}
		});
	}
}

// Login Admin 

var loginAdmin=function(req,res){
   var email = req.body.email;
   var password = req.body.password;

   if(email && password){
   		adminSchema.findOne({email:email},{},function(err, getData){
   			if(err) return res.send({status:400,message:'Please provide email and password!.'});
   			if(getData){
   				bcrypt.compare(password,getData.password,function(err,result){
   					if(result){
   						jwt.sign({email : email}, 'digitalDiary',{expiresIn:'10min'},function(err, result){
		                 res.send({status:200,message:'login successfully',data:getData,token:result});
                     	})   						
   					}else{
   						res.send({status : 400, message : "password doest not match"})
   					}
   				})
   			}else{
   				return res.send({status:400,message:'Email doesnot exists.Please register'});
   			}
   		})
   }else{
   	return res.send({status:400,message:'Please provide email and password!.'});
   }
}

// Get All Admin

var getAdmin = function(req,res){
	    adminSchema.find({},{},function(err,data){
	    if(err) return res.send({status : 400, message :"error"});
		return res.send({status:200,message:"get admins",data:data});
	})
}

// Get Admin By Id based on fields

var getAdminByIdByFields = function(req, res){
	adminSchema.findOne({_id : req.body.id},{firstName : 1},function(err, data){
		if(err)return res.send({status : 400, message :"error"});
		return res.send({status : 200, message :"Admin Data get Success fully", data : data});	
	});
}

// Get Admin By Id based on fields

var getAdminById = function(req, res){
	adminSchema.findOne({_id : req.body.id},{_id : 1,firstName : 1,lastName : 1,email : 1,image : 1,role : 1,address: 1,contactNo:1,department:1,designation:1,doj:1,dob:1,marks : 1},function(err, data){
		if(err)return res.send({status : 400, message :"error"});
		return res.send({status : 200, message :"Admin Data get Success fully", data : data});	
	});
}

//update admin by id

var updateAdminById = function(req,res){
	console.log("req.body.id 12= = "+req.body.id);
	if(req.body.id &&req.body.firstName){
		adminSchema.update({_id:req.body.id},{$set : { firstName : req.body.firstName, lastName: req.body.lastName,contactNo : req.body.contactNo,address : req.body.address, designation : req.body.designation, department : req.body.department, marks : req.body.marks,image:req.body.image,dob : req.body.dob,doj : req.body.doj}},function(err,updateData){
		if(err) return res.send({status : 400, message :"error"});
		return res.send({status:200,message:"Update Successfull!."});
	})
   }else{
   	    res.send({status : 400, message :"error"});
   }
	
}

// Delete admin by id 

var deleteAdminById=function(req,res){
	if(req.body.id){
		adminSchema.remove({_id : req.body.id},function(err,deleteData){
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


var getdata = function(req, res){
	var request = req.body.marks;
	console.log('getdatagetdatagetdata',request);
	if(request){
		adminSchema.find({},{},function(err, data){		
			let counter =0;
			let arr = [];
			
			async.forEachLimit(data,1,function(element,next){
				counter++;
				if(counter < data.length){
					arr.push({marks : element.marks+2});
					console.log('array',arr);
					next();
				}else{
					return res.send({status : 200, message : 'result',data : arr});
				}
			});


		})
	}else{

	}
}


var getdataWaterFall = function(req, res){
	async.waterfall([
		function(callback){
			console.log('i am inside the function one');
			let data = [{name:'pankaj'}];
			callback(null,data);
		},
		function(data,callback){
			data.push({name:"gaurav"});
			console.log('i am inside the function two',data);
			callback(null,data);
		}
		],function(err,result){	
			console.log('i am final result',result);
		});
}


// image upload 

var imageUpload = function(req,res){
	cloudinary.config({
		cloud_name : cloud_name,
		api_key    : api_key,
		api_secret : api_secret		
    });

	var image = req.body.image;
	var binaryData = new Buffer(image,'base64');
	console.log('binaryDatabinaryDatabinaryData',binaryData);
	fs.writeFile('image'+'.jpg',binaryData,'binary',function(err){
		cloudinary.uploader.upload("image"+'.jpg', function(result)
	   {
	   	res.send({status :200, message : "Image upload successfully!.",data : result})
	      console.log(result.url);
       });	
	});
	
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
exports.loginAdmin=loginAdmin;
exports.getAdmin=getAdmin;
exports.getAdminById=getAdminById;
exports.postData1 = postData1;
exports.postData = postData;
exports.updateAdminById=updateAdminById;
exports.deleteAdminById=deleteAdminById;
exports.sendMessage = sendMessage;
exports.getdata = getdata;
exports.imageUpload = imageUpload;

exports.getAdminByPageNo = getAdminByPageNo;
exports.getThirdPartyData = getThirdPartyData;



exports.getdataWaterFall = getdataWaterFall;