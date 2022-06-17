/**
 * @Author: maple
 * @Date: 2022-06-17 11:39:08
 * @LastEditors: maple
 * @LastEditTime: 2022-06-17 13:41:13
 */
const async = require('async');
const fs = require('fs');
const path = require('path');

const checkSameFile = function (filename, callback) {
  // eslint-disable-next-line n/handle-callback-err
  fs.stat(filename, function (err, state) {
    if (state) {
      if (filename.match(/(\([0-9]+\)){1}\.\w+/)) {
        const q = filename.match(/(\([0-9]+\)){1}\.{1}\w+/);
        const s = q[0];
        const tmp = filename.slice(0, q.index);
        const s1 = s.split('(')[0];
        const s2 = s.split(')')[1];
        let num = s.slice(s1.length + 1, s.length - s2.length - 1);
        num = parseInt(num) + 1;
        filename = tmp + s1 + '(' + num + ')' + s2;
      } else if (filename.match(/\([0-9]+\)$/)) {
        const q = filename.match(/\([0-9]+\)$/);
        const s = q[0];
        const tmp = filename.slice(0, q.index);
        const s1 = s.split('(')[0];
        const s2 = s.split(')')[1];
        let num = s.slice(s1.length + 1, s.length - s2.length - 1);
        num = parseInt(num) + 1;
        filename = tmp + s1 + '(' + num + ')' + s2;
      } else {
        let tmp = filename.match(/\.\w+$/);
        if (tmp) {
          tmp = tmp.index;
          filename = filename.slice(0, tmp) + '(0)' + filename.slice(tmp, filename.length);
        } else {
          filename = filename + '(0)';
        }
      }
      return checkSameFile(filename, callback);
    } else {
      return callback(undefined, filename);
    }
  });
};

const saveFile = function (buf, filename, filepath, options = {}, callback) {
  let fullPath = path.join(filepath, filename);

  async.series([
    function (cb) {
      if (!filename) {
        return cb(new Error('illegal filename'));
      } else {
        return cb();
      }
    },
    function (cb) {
      checkSameFile(fullPath, function (err, resultPath) {
        if (err) {
          return cb(err);
        }

        if (options.renameSameFile === false && fullPath !== resultPath) {
          return cb(new Error('same file has been downloaded.'));
        }

        fullPath = resultPath;
        cb();
      });
    },
    function (cb) {
      fs.writeFile(fullPath, buf, {}, function (err, data) {
        if (err) {
          cb(err);
        } else {
          cb();
        }
      });
    }
  ], function (err) {
    callback(err, fullPath);
  });
};

exports.saveFile = saveFile;

exports.checkSameFile = checkSameFile;

const check = require('util').promisify(checkSameFile);

exports.hasSameFile = async function (filename) {
  const checkedPath = await check(filename);
  if (checkedPath !== filename) {
    return true;
  }

  return false;
};
