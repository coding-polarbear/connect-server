var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fileupload = require('express-fileupload');

var db = mongoose.connection;
db.on('error', console.error)
    .once('open',() => {
        console.log('Connect to mongodb server ' + db.name);
    });
mongoose.connect('mongodb://localhost:27017/test',
    { useMongoClient: true });

var index = require('./routes/index');
var users = require('./routes/users');
var signs = require('./routes/sign');
var schools = require('./routes/schools');
var channels = require('./routes/channels');

var authentication = require('./tools/authentication');

var app = express();

//안드로이드 지원을 위한 json 설정
app.use((req, res, next) => {
    if(req.body && req.body.data)
        req.body = JSON.parse(req.body.data);
    next();
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());
app.use(authentication);

app.use('/', index);
app.use('/users', users);
app.use('/sign', signs);
app.use('/schools', schools);
app.use('/channels', channels);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  res.status(200).json({result : {success: false, message : '알 수 없는 오류가 발생하였습니다!'}});
});

module.exports = app;
