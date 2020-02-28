const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routes = require('./routes/');
const session  = require('express-session');
const fs = require('fs');
const rfs = require("rotating-file-stream");
const path = require('path');
const {generator} = require('./utils/utils');
const database = require('./database');

const app = express();



const logDir = './logs';
if (!fs.existsSync(logDir)){
  fs.mkdirSync(logDir);
}

// create a rotating write stream
const accessLogStream = rfs.createStream(generator, {
  interval: '1d', // rotate daily
  path: path.join(__dirname, logDir)
});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(session({
  secret: "tqt",
  resave: true,
  saveUninitialized: true,
  cookie: {}
}));



app.use(logger('common', { stream: accessLogStream }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

routes.forEach(r => {
  app.use('/' + r.path, r.handler);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});

require('./controllers/mangakakalot');


module.exports = app;
