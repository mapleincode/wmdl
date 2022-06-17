/**
 * @Author: maple
 * @Date: 2022-06-17 11:39:08
 * @LastEditors: maple
 * @LastEditTime: 2022-06-17 12:53:01
 */
const async = require('async');
const request = require('request');
// const config = require('../config');

const down = function (url, timeout, callback) {
  request(
    {
      method: 'GET',
      uri: url,
      encoding: null,
      gzip: true,
      timeout
    },
    function (err, response, body) {
      if (err) {
        return callback(err);
      } else {
        return callback(undefined, Buffer.from(body, 'binary'));
      }
    });
};

const download = function (url, params, callback) {
  const retry = params.retry || 5;
  async.retry(retry, down.bind(null, url, params.timeout || 5000), callback);
};

exports.down = download;
