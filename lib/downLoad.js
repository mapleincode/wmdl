var request = require('request');
var config = require('../config');


var down = function(url, params, callback) {
    console.log(url);
    request(
        {
            method: 'GET',
            uri: url,
            encoding: null,
            gzip: true,
            timeout: params.timeout
        },
         function(err, response, body) {
            if (err) {
                return callback(err);
            }
            else {
                return callback(undefined, new Buffer(body, "binary"))
            }
        });
}

exports.down = down;