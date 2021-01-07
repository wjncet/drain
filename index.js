var express = require('express'),
   winston = require('winston'),
    Q = require('q'),
    db = require('./pghelper'),
        
    app = express();

var logger = new (winston.Logger)({
  transports: [
    // 使う出力方法を transports で宣言する
    new (winston.transports.Console)({
      level: 'silly', // level は silly 以上
      colorize: true, // 色付き
      timestamp: true, // 時間つき
      debugStdout: true
    })
  ]
});

function log_body(body) {
//  if (process.env.LOG_BODY) {
    console.log(body);
//  }
}

function log_headers(req, headers) {
  if (process.env.LOG_HEADERS) {
    var interested = headers.reduce(function(str, key) {
      str += "\n" + key + ": " + req.get(key);
      return str;
    }, '');
    console.log("\n", interested, "\n");
  }
}

function body_parser(req, res, next) {
  if (!req.is('application/logplex-1')) {
    res.send(500, 'invalid');
    return;
  }

  req.logplexLogs = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
//      console.log('app.post　chunk:' + chunk);
    req.logplexLogs += chunk;
  });
  req.on('end', next);
}



app.use(body_parser);


var i = true;
db.setLogger(logger);

app.post('/logs', function(req, res) {

    console.log('app.post開始:' );
    
  
 // log_headers(req, ['Host', 'Con' ,'Content-Type' ,'Logplex-Msg-Count' ,'Logplex-Frame-Id' ,'Logplex-Drain-Token' ,'User-Agent' ,'Content-Length' ,'Connection']);
  log_body(req.logplexLogs);

   if(i){
         log_body_DB(req.logplexLogs);
      }
    i=false;
    console.log('app.post終了:' );
  res.send(201);
});

app.set('port', process.env.PORT || 5000);
var server = app.listen(app.get('port'), function () {
  console.log('Listening on port %d', server.address().port);
});


function log_body_DB(body) {
    console.log(" log_body_DBlog_body_DBlog_body_DBlog_body_DBlog_body_DB log_body_DB\n");
    db.query(
    db.insertSQL,
    [1, 2, 3, 4], true)
    console.log(" END END  END  END  END  END   END  \n");
}
