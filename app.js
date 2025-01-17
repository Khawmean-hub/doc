require('dotenv').config()
const express = require('express');
var app = express()
const cors = require('cors');
const bodyParser = require('body-parser');

// allow origin network https
var allowedOrigins = ['http://192.168.178.81:88', 'http://localhost:4545', 'http://127.0.0.1:4545', 'http://192.168.178.81:4545','http://54.251.201.192:4545', 'http://192.168.178.81:81', ];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

//
//static file 
app.use('/', express.static('public'));

//json
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use('/image', express.static(process.env.IMG_PATH));

// Routes
app.use(require('./routes/home'));
app.use(require('./routes/fileRes'));


app.listen(process.env.PORT)      
   