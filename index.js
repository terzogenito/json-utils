const fs = require('fs');
const https = require('https');

function getString(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function getFile(filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return;
    } else {
      callback(data);
    }
  });
}

function loadFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function getData(filePath) {
  try {
    const data = await loadFile(filePath);
    return data;
  } catch {
    return null;
  }
}

function getURL(url, callback) {
  https.get(url, (response) => {
    let data = '';
    response.on('data', chunk => {
      data += chunk;
    });
    response.on('end', () => {
      callback(data || null);
    });
  }).on('error', (err) => {
    callback(null);
  });
}

function isUrl(input) {
  const urlPattern = /^(https?:\/\/|ftp:\/\/|www\.)/i;
  return urlPattern.test(input);
}

function getContent(target, callback) {
  if (isUrl(target)) {
    getURL(target, callback);
  } else {
    getFile(target, callback);
  }
}

function readJSON(jsonString) {
  return JSON.parse(jsonString);
}

function toString(jsonObject) {
  return JSON.stringify(jsonObject);
}

function isValid(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

function isJSON(jsonObject) {
  try {
    const parsedData = JSON.parse(jsonObject);
    return typeof parsedData === 'object' && parsedData !== null;
  } catch (error) {
    return false;
  }
}

function isJSONObject(jsonObject) {
  try {
    return typeof jsonObject === 'object' && jsonObject !== null && jsonObject !== undefined;
  } catch (error) {
    return false;
  }
}

function getJSON(target, callback) {
  getContent(target, data => {
    if (!data) {
      return callback(null);
    }
    if (!isValid(data)) {
      return callback(null);
    }
    try {
      callback(readJSON(data));
    } catch {
      callback(null);
    }
  });
}

function beautifyJSON(jsonString, indent = 2) {
  try {
    if (typeof jsonString !== 'string') return null;
    const jsonObject = JSON.parse(jsonString);
    return JSON.stringify(jsonObject, null, indent);
  } catch {
    return null;
  }
}

function beautify(jsonObject, indent) {
  try {
    if (!indent) indent = 2;
    return JSON.stringify(jsonObject, null, indent);
  } catch (error) {
    return null;
  }
}

module.exports = {
  getString,
  getFile,
  getData,
  getURL,
  getContent,
  readJSON,
  toString,
  isValid,
  isJSON,
  isJSONObject,
  getJSON,
  beautifyJSON,
  beautify,
};