var async = require('async');
var fs = require('fs');

 var checkSameFile = function(fileName, callback) {
     fs.stat(fileName, function(err, state) {
        // console.log(fileName);
         if (state) {
            // console.log('same fi/le');
            if (fileName.match(/(\([0-9]+\)){1}\.\w+/)) {
                var q = fileName.match(/(\([0-9]+\)){1}\.{1}\w+/);
                var s = q[0];
                var tmp = fileName.slice(0, q.index);
                var s1 = s.split('(')[0];
                var s2 = s.split(')')[1];
                var num = s.slice(s1.length + 1, s.length - s2.length - 1);
                num  = parseInt(num)  + 1;
                fileName = tmp +  s1 + '(' + num + ')' + s2;
            }
            else if (fileName.match(/\([0-9]+\)$/)) {
                var q = fileName.match(/\([0-9]+\)$/);
                var s = q[0];
                var tmp = fileName.slice(0, q.index);
                var s1 = s.split('(')[0];
                var s2 = s.split(')')[1];
                var num = s.slice(s1.length + 1, s.length - s2.length - 1);
                num  = parseInt(num)  + 1;
                fileName = tmp +  s1 + '(' + num + ')' + s2;
            }
            else {
                // console.log(fileName);
                var tmp = fileName.match(/\.\w+$/);
                if (tmp) {
                    tmp  = tmp.index;
                    fileName = fileName.slice(0,tmp) + '(0)' + fileName.slice(tmp, fileName.length);
                }
                else {
                    fileName = fileName + '(0)';
                }
                // fileName = fileName.slice(0,tmp) + '(0)' + fileName.slice(tmp, fileName.length);

            }
            return checkSameFile(fileName, callback);
        }
        else {
            return callback(undefined, fileName);
        }
    });
};


var saveFile = function(buf, fileName, callback) {
    async.series([
        function(cb) {
            if (!fileName) {
                return cb(new Error('filename为空'));
            }
            else {
              return cb();
            }
        },
        function(cb) {
            checkSameFile(fileName, function(err, resultPath) {
                if (err) {
                    cb(err);
                }
                else {
                    fileName = resultPath;
                    // console.log(fileName);
                    cb();
                }
            });
        },
        function(cb) {
            // console.log(fileName);
            fs.writeFile(fileName, buf, {}, function(err, data) {
                if (err) {
                    cb(err);
                }
                else {
                    cb();
                }
            });
        }
    ], function(err){
        callback(err, fileName);
    });
};

exports.saveFile = saveFile;