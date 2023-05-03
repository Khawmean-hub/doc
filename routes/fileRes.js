const express = require('express');
const multer = require('multer');
const { MessageEnum } = require('../utils/message.enum');
const Resize = require('../utils/Resize');
const BaseRes = require('../utils/Response');
var fileRoute = express.Router();
// var upload = require('../utils/uploadMiddleware');

/*------------------------------------------
--------------------------------------------
image upload code using multer
--------------------------------------------
--------------------------------------------*/
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, process.env.IMG_PATH);
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
   }
});
var upload = multer({ storage: storage });


// Handel file or image size
// const fileSizeLimitHandler = (err, req, res, next) => {
//   if (err) {
//     res.send(new BaseRes(false, "Image size is too large. limit (200 MB)", null));
//   } else {
//     next()
//   }
// }

//  const fileSizeLimitHandler = (err, req, res, next) => {
//    if (err) {
//     res.send(new BaseRes(false, "Image size is too large. limit (200 MB)", null));
//    } else {
//      next()
//    }
//  }

// file upload
// fileRoute.post('/upload', upload.single('image'), fileSizeLimitHandler, async (req, res) => {
//   const fileUpload = new Resize(process.env.IMG_PATH);
//   if (!req.file) {
//     return res.status(401).json(new BaseRes(false, MessageEnum.UPLOAD_FAILED, null));
//   }
//   const filename = await fileUpload.save(req.file.buffer);
//   var data = {
//     url: process.env.URL + "/image/" + filename,
//     fileName: filename
//   }
//   res.send(new BaseRes(true, MessageEnum.UPLOAD_SUCCESS, data));
// });

// File upload
fileRoute.post('/upload', upload.single('file'), async (req, res) => {
   res.send(new BaseRes(true, MessageEnum.UPLOAD_SUCCESS, { url: process.env.URL + "/image/" + req.file.filename, fileName: req.file.filename }));
   // need url and file name
   // url http://localhost:4545/image/1682992645474-DSCF2454.JPG
   // fileName 1682992645474-DSCF2454.JPG
});







module.exports = fileRoute;

