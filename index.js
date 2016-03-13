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
    var timeout;

    if (!uri || typeof uri !== 'string') {
        return callback(new Error('uri不存在'));
    }

    if (typeof tmp === 'string') {
        fileName = tmp;
    }
    else if (tmp) {
        fileName = tmp.fileName;
        defaultLocation = tmp.defaultLocation;
        timeout = tmp.timeout;
    }

    if (!fileName) {
        fileName = (uri + '').match(/\[w\_\-\&]+.\w+$/);
        if(!fileName) {
            return callback(new Error('链接名不带 fileName'));
        } 
        else {
            fileName = fileName[0];
        }
    }
    if (!timeout) {
        timeout = 5000;
    }

    var path = getPath.get(fileName, defaultLocation);



    async.waterfall([
        function(cb) {
            checkPath.checkPath(path, cb);
        },
        function(cb) {
            downLoad.down(uri, {timeout: timeout}, cb);
        },
        function(file, cb) {
            save.saveFile(file, path, cb);
        }
    ], function(err) {
        return callback(err, path);
    });

};

exports.wmdl = wmdl;
