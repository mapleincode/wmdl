/**
 * @Author: maple
 * @Date: 2022-06-17 11:39:08
 * @LastEditors: maple
 * @LastEditTime: 2022-06-17 12:52:54
 */
const config = require('../config');

let DEFAULT_LOCATION = config.DEFAULT_LOCATION;

if (!DEFAULT_LOCATION) {
  DEFAULT_LOCATION = process.cwd();
}

const getPath = function (location, defaultLocation) {
  if (!defaultLocation) {
    defaultLocation = DEFAULT_LOCATION;
  }
  if (location[0] === '/') {
    location = location.substr(1);
  }
  if (defaultLocation[defaultLocation.length] !== '/') {
    defaultLocation = defaultLocation + '/';
  }
  return defaultLocation + location;
};

exports.get = getPath;
