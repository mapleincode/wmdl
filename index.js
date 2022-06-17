/**
 * @Author: maple
 * @Date: 2022-06-17 11:39:08
 * @LastEditors: maple
 * @LastEditTime: 2022-06-17 13:49:36
 */
const path = require('path');
const util = require('util');

const checkPath = require('./lib/check_path');
const downLoad = require('./lib/download');
const saveFile = require('./lib/save_file');

const check = util.promisify(checkPath.checkPath);
const down = util.promisify(downLoad.down);
const save = util.promisify(saveFile.saveFile);

const wmdl = async function (uri, downloadPath, options = {}) {
  if (!uri || typeof uri !== 'string') {
    throw new Error('uri不存在');
  }

  if (typeof downloadPath === 'object') {
    options = downloadPath;
    downloadPath = options.downloadPath;
  }

  let filename = options.filename;
  const timeout = options.timeout || 5000;
  const retry = options.retry || 0;
  const renameSameFile = typeof options.renameSameFile === 'boolean' ? options.renameSameFile : true;
  if (!downloadPath) {
    downloadPath = process.cwd();
  } else {
    downloadPath = path.resolve(process.cwd(), downloadPath);
  }

  const dlPath = path.parse(downloadPath);

  if (!filename && dlPath.ext) {
    filename = `${dlPath.name}${dlPath.ext}`;
    downloadPath = dlPath.dir;
  } else if (!filename) {
    const filenameMatchs = (uri + '').match(/[\w_\-&=]+.\w+$/);
    if (!filenameMatchs) {
      throw new Error('missing filename');
    } else {
      filename = filenameMatchs[0];
    }
  }

  await check(downloadPath);

  const hasSameFile = await saveFile.hasSameFile(path.join(downloadPath, filename));
  if (hasSameFile) {
    throw new Error('same file has been downloaded.');
  }

  const file = await down(uri, { timeout, retry });

  await save(file, filename, downloadPath, { renameSameFile });
};

exports.wmdl = wmdl;
