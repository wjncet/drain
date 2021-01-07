var pg = require('pg'),
    Query = require('pg').Query,
    config = require('./config'),
    Q = require('q'),
//    logger = require('winston'),
    url = require('url'),
    databaseURL = config.databaseURL;

if (process.env.DATABASE_URL){
  if (process.env.DATABASE_URL.indexOf('ssl=true') == -1){
    databaseURL = databaseURL + "?ssl=true";
  }
}
/*
exports.setLogger = function(lg){
  logger = lg;
};*/

var urlParams;
/**
 * postgresのURLから要素を取り出し、DB接続のパラメータとする
 * @returns {object}
 */
function getUrlParams(){
  if (urlParams != undefined) {
    return urlParams;
  }
  var params = url.parse(databaseURL);
  var authprm = params.auth.split(':');
  urlParams = {
    user: authprm[0],
    password: authprm[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
  };
  if (params.search !== null
    && params.search.indexOf('ssl=true') > -1){
    urlParams.ssl = true;
  }
  return urlParams;
}

/**
 * Utility function to execute a SQL query against a Postgres database
 * @param sql
 * @param values
 */
exports.query = function (sql, values) {

    var pool = new pg.Pool(getUrlParams());
    
    /*
    pool.connect(function (err, conn, done) {
        if (err) {
            console.log("connect err 発生:: "+ err);
        };
        try {
            conn.query(sql, values, function (err, result) {
                conn.
                done();
                if (err) {
                   console.log("query err 発生1:: "+ err);
                }
            });
        }
        catch (e) {
             console.log("query err 発生2:: "+ err);
            done();
        }finally{
            conn
        }
    });*/

};

exports.doQueryCategoryInfo = function (sql, values) {
    var p = new Promise(function (resolve, reject) {
        //做一些异步操作
        pool.connect().then(client => {
            // insert 数据
            client.query(sql, values).then(res => {
                client.release() //释放连接池
                var value = res.rows
                resolve(value)
                return res
            })
        })
    });
    return p;
}

exports.insertSQL =' INSERT INTO salesforce.ErrorLog__c ('
      +   ' FunctionID__c'
      +  ', ErrorCode__c'
      +  ', ErrorMessage__c'
      +  ', KeyInfomation__c'
      + ') VALUES ($1, $2, $3, $4) ';
    
