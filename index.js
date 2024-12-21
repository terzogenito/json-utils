const fs = require('fs');
const https = require('https');

function getFile(filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
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
  } catch (err) {
    console.error("Error reading the file:", err);
  }
}

function getURL(url, callback) {
  https.get(url, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      callback(data);
    });
  }).on('error', (err) => {
    console.error("Error fetching the URL:", err);
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
  } catch (error) {
    console.log("The string is not valid JSON.");
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

function getJSON(target, callback) {
  getContent(target, data => {
    if (isValid(data)) {
      callback(readJSON(data));
    }
  });
}

function beautifyJSON(jsonString, indent) {
  try {
    const jsonObject = JSON.parse(jsonString);
    if (!indent) indent = 2;
    return JSON.stringify(jsonObject, null, indent);
  } catch (error) {
    console.error("Invalid JSON string:", error);
    return null;
  }
}

module.exports = {
  getFile,
  getData,
  getURL,
  getContent,
  readJSON,
  toString,
  isValid,
  isJSON,
  getJSON,
  beautifyJSON,
};