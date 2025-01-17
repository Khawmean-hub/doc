const express = require('express');
const multer = require('multer');
const { MessageEnum } = require('../utils/message.enum');
const Resize = require('../utils/Resize');
const BaseRes = require('../utils/Response');
var fileRoute = express.Router();
// var upload = require('../utils/uploadMiddleware');



var  storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, process.env.IMG_PATH);
   },
   filename: function (req, file, cb) {
      cb(null, file.originalname);
   }
});
var upload = multer({ storage: storage, defParamCharset: 'utf8', defCharset: 'utf8'});





// File upload
fileRoute.post('/upload', upload.single('file'), async (req, res) => {
   res.send(new BaseRes(true, MessageEnum.UPLOAD_SUCCESS, { url: process.env.URL + "/image/" + req.file.filename, fileName: req.file.filename}));
   // need url and file name
   // url http://localhost:4545/image/1682992645474-DSCF2454.JPG
   // fileName 1682992645474-DSCF2454.JPG
});




module.exports = fileRoute;

