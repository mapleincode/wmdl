var async = require('async');

var checkPath   = require('./lib/checkPath');
var config      = require('./config');
var downLoad    = require('./lib/downLoad');
var getPath     = require('./lib/getPath');
var save        = require('./lib/save');




var wmdl = function(/*uri, path, params, callback*/) {
    var callback = Array.prototype.pop.call(arguments);
    var uri = Array.prototype.shift.call(arguments);
    var tmp = Array.prototype.shift.call(arguments);
    var fileName;
    var defaultLocation;
    var timeout = 5000;
    var retry = 0;

    if (!uri || typeof uri !== 'string') {
        return callback(new Error('uri不存在'));
    }

    if (typeof tmp === 'string') {
        fileName = tmp;
    }
    else if (tmp) {
        fileName = tmp.fileName;
        defaultLocation = tmp.defaultLocation;
        timeout = tmp.timeout? tmp.timeout: timeout;
        retry = tmp.retryTime;
    }

    if (!fileName) {
        fileName = (uri + '').match(/[\w\_\-\&\=]+.\w+$/);
        if(!fileName) {
            return callback(new Error('链接名不带 fileName'));
        } 
        else {
            fileName = fileName[0];
        }
    }

    var path = getPath.get(fileName, defaultLocation);



    async.waterfall([
        function(cb) {
            checkPath.checkPath(path, cb);
        },
        function(cb) {
            downLoad.down(uri, {timeout: timeout, retry: retry}, cb);
        },
        function(file, cb) {
            save.saveFile(file, path, cb);
        }
    ], function(err, result) {
        // console.log(err, result);
        return callback(err, result);
    });

};

exports.wmdl = wmdl;
