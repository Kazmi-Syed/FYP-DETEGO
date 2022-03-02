require('dotenv').config(); //.Env file must use .gitignore
var createError = require('http-errors'); //Error Handling
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session= require("express-session");


//USe jwt for authorization and purposes
const Pass = require('passport');
const PassL = require('passport-local');
const PLM = require('passport-local-mongoose');

//SEcret Keys and variables
//must be stored in ENVvironment file 
//Git ignore is must
const SECRET_KEY="ShEEfU12.";
const SALT_ROUNDS=12;
//Object or instance of express
var app = express();

//DAtabase
var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true, 
useUnifiedTopology: true,
useCreateIndex: true,
autoIndex: true,
// ssl : true,
// sslValidate: true,
// sslKey : ,
// sslCert : , 
});

mongoose.connection.on('error', err => {
  console.log(err);
});
//color 16b8d1
// color: rgb(14, 62, 124);
//Importing Models
var std = require("./models/studentdb");
//Importing Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var interfacesRouter = require('./routes/home');

//TEST

const tests = require('./routes/tests');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//For logs
app.use(logger('dev'));
//Body parser for Post requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Cookie parser
app.use(cookieParser());
//session setup
app.use(session({
  secret: SECRET_KEY,
  saveUninitialized: true,
  resave: true,
  cookie:{
    httpOnly:true,
    //secure:true,
    maxage: 60*7*1000,
  }
}));
//done session setup
//Stylesheet and client side js files are to be included here
app.use(express.static(path.join(__dirname, 'public')));
//Routes management
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/home" , interfacesRouter);
app.use('/tests' , tests);//must be deleted while submitting
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
