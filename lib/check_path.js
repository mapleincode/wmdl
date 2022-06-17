/**
 * @Author: maple
 * @Date: 2022-06-17 11:39:08
 * @LastEditors: maple
 * @LastEditTime: 2022-06-17 13:03:24
 */
const async = require('async');
const fs = require('fs');

const checkPath = function (path, callback) {
  if (!path || typeof path !== 'string') {
    return callback(new Error('error path format'));
  }
  if (path[0] !== '/') {
    path = '/' + path;
  }

  path = path.replace(/[\w\-_& !=%]+(\.\w+)?$/, '');

  if (path !== '/' && !path.match(/^\/([\w\W=&! \-_%]+\/)+$/)) {
    return callback(new Error('error path format'));
  }

  const arr = path.split('/');
  arr.push();
  arr.shift();

  let str = '';
  async.eachLimit(arr, 1, function (p, cb) {
    str = str + '/' + p;
    fs.stat(str + '/', function (err, stats) {
      if (err) {
        fs.mkdir(str, '0751', function (err) {
          if (err) {
            if (err.errno === -13) {
              err = new Error('need root permissions.');
            } else {
              // 目录已存在
              err = undefined;
            }
            cb(err);
          } else {
            cb(undefined);
          }
        });
      } else {
        if (stats.isDirectory()) {
          cb(undefined);
        } else {
          cb(new Error('same name file existed.'));
        }
      }
    });
  }, function (err) {
    callback(err);
  });
};

exports.checkPath = checkPath;
