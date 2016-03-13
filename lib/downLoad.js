var async = require('async');
var request = require('request');
var config = require('../config');


var down = function(url, timeout, callback) {
    // console.log(url);
    request(
        {
            method: 'GET',
            uri: url,
            encoding: null,
            gzip: true,
            timeout: timeout
        },
         function(err, response, body) {
            if (err) {
                return callback(err);
            }
            else {
                return callback(undefined, new Buffer(body, "binary"))
            }
        });
};

var download = function(url, params, callback) {
    var retry = params.retry || 5;
    async.retry(retry, down.bind(null, url, params.timeout || 5000), callback);
};

exports.down = download;
// exports.down = down;