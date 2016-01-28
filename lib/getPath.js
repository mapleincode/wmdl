var config = require('../config');

var DEFAULT_LOCATION  = config.DEFAULT_LOCATION;

if (!DEFAULT_LOCATION) {
    DEFAULT_LOCATION = process.cwd();
}

var getPath = function(location, defaultLocation) {
    if (!defaultLocation) {
        defaultLocation = DEFAULT_LOCATION;
    }
    if (location[0] === '\/') {
        location = location.substr(1);
    }
    if (defaultLocation[defaultLocation.length] !== '\/') {
        defaultLocation = defaultLocation + '\/';
    }
    return defaultLocation + location;
};

exports.get = getPath;