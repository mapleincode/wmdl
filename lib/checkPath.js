var async = require('async');
var fs = require('fs');

var checkPath = function(path, callback) {
    if (!path || typeof path !== 'string') {
        return callback(new Error('path不存在'));
    }
    if (path[0] !== '\/') {
        path = '\/' + path;
    }

    path = path.replace(/[\w\-\_\&\ \=]+(\.\w+)?$/, '');

    if (path === '\/' || path.match(/^\/([\w\=\&\ \-\_]+\/)+$/)) {
    }
    else {
        return callback(new Error('path格式不符合'));
    }
    var arr  = path.split('\/');
    arr.push();arr.shift();
    var str = '';
    async.eachLimit(arr, 1, function(p, cb) {
        str = str + '\/' + p;
        fs.stat(str + '\/', function(err, stats) {
            if (err) {
                fs.mkdir(str, '0751', function(err) {
                    if (err) {
                        if (err.errno == -13 ) {
                            err = new Error('需要 root 权限哦~喵~');
                        }
                        cb(err);
                    }
                    else {
                        cb(undefined);
                    }

                });
            }
            else {
                if (stats.isDirectory()) {
                    cb(undefined);
                }
                else {
                    cb(new Error('有同名的file存在'));
                }
            }
        });
    }, function(err) {
        callback(err);
    });
};

exports.checkPath = checkPath;
