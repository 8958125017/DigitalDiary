
var express  = require('express');
var adminCtrl= require('../../controller/adminController');
var router   = express.Router();

router.post('/createAdmin'       ,adminCtrl.createAdmin       );
router.post('/loginAdmin'        ,adminCtrl.loginAdmin        );
router.get ('/getAdmin'          ,adminCtrl.getAdmin          );
router.post('/getAdminById'      ,adminCtrl.getAdminById      );
router.post('/updateAdminById'   ,adminCtrl.updateAdminById   );
router.post('/postData/:id'      ,adminCtrl.postData          ); //get params by route
router.post('/postData1/:id'     ,adminCtrl.postData1         );
router.post('/deleteAdminById'   ,adminCtrl.deleteAdminById   );
router.post('/sendMessage'       ,adminCtrl.sendMessage       );
router.post('/getdata'           ,adminCtrl.getdata           );
router.post('/imageUpload'       ,adminCtrl.imageUpload       );
router.get ('/getThirdPartyData' ,adminCtrl.getThirdPartyData );
router.post('/getAdminByPageNo'  ,adminCtrl.getAdminByPageNo  );

router.get('/getdataWaterFall', adminCtrl.getdataWaterFall);

module.exports = router;