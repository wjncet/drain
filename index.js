var express = require('express'),
    app = express();
var bodyParser = require('body-parser')

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


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(500).send(err.message);
});

//app.use(body_parser);





app.post('/logs', function(req, res) {
    console.log("JSON.stringify::: "+JSON.stringify(req.body));
    console.log('app.post開始:' );
    
  
 // log_headers(req, ['Host', 'Con' ,'Content-Type' ,'Logplex-Msg-Count' ,'Logplex-Frame-Id' ,'Logplex-Drain-Token' ,'User-Agent' ,'Content-Length' ,'Connection']);
  log_body(req.logplexLogs);
    console.log('app.post終了:' );
  res.send(201);
});

app.set('port', process.env.PORT || 5000);
var server = app.listen(app.get('port'), function () {
   console.log('server listening on port :' + app.get('port'));
  console.log('Listening on port %d', server.address().port);
});
