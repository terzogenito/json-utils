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

function getAttributes(jsonObject) {
  try {
    if (typeof jsonObject === 'string') {
      jsonObject = JSON.parse(jsonObject);
    }

    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return [];
    }

    return Object.keys(jsonObject);
  } catch (error) {
    return [];
  }
}

function getMeta(jsonObject) {
  try {
    if (typeof jsonObject === 'string') {
      jsonObject = JSON.parse(jsonObject);
    }

    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return {};
    }
    
    const meta = {};

    for (const [key, value] of Object.entries(jsonObject)) {
      let type = typeof value;

      if (type === 'object') {
        if (value === null) {
          type = 'null';
        } else if (Array.isArray(value)) {
          type = 'array';
        } else if (value instanceof Date) {
          type = 'date';
        } else {
          type = 'object';
        }
      } else if (type === 'number') {
        type = Number.isInteger(value) ? 'integer' : 'float';
      }
      
      meta[key] = type;
    }
    
    return meta;
  } catch (error) {
    return {};
  }
}

function getMetaDetail(jsonObject) {
  try {
    if (typeof jsonObject === 'string') {
      jsonObject = JSON.parse(jsonObject);
    }

    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return {};
    }

    function getNestedMeta(obj, path = '') {
      const meta = {};
      
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        const attributeMeta = {};

        let type = typeof value;

        if (value === null) {
          type = 'null';
          attributeMeta.type = type;
          attributeMeta.isRequired = false;
          attributeMeta.path = currentPath;
        } else if (Array.isArray(value)) {
          type = 'array';
          attributeMeta.type = type;
          attributeMeta.length = value.length;
          attributeMeta.isRequired = true;
          attributeMeta.path = currentPath;

          if (value.length > 0) {
            const firstElement = value[0];
            const elementType = typeof firstElement;
            
            if (elementType === 'object' && firstElement !== null) {
              if (Array.isArray(firstElement)) {
                attributeMeta.elementType = 'array';
              } else {
                attributeMeta.elementType = 'object';
                attributeMeta.children = getNestedMeta(firstElement, `${currentPath}[0]`);
              }
            } else {
              attributeMeta.elementType = elementType;
            }
          } else {
            attributeMeta.elementType = 'unknown';
          }
        } else if (value instanceof Date) {
          type = 'date';
          attributeMeta.type = type;
          attributeMeta.isRequired = true;
          attributeMeta.path = currentPath;
        } else if (type === 'object') {
          type = 'object';
          attributeMeta.type = type;
          attributeMeta.isRequired = true;
          attributeMeta.path = currentPath;
          attributeMeta.keysCount = Object.keys(value).length;

          attributeMeta.children = getNestedMeta(value, currentPath);
        } else {
          attributeMeta.type = type;
          attributeMeta.isRequired = true;
          attributeMeta.path = currentPath;

          if (type === 'number') {
            attributeMeta.numberType = Number.isInteger(value) ? 'integer' : 'float';
          }
        }

        meta[key] = attributeMeta;
      }
      
      return meta;
    }
    
    return getNestedMeta(jsonObject);
  } catch (error) {
    console.error('Error in getMetaDetail:', error);
    return {};
  }
}

function getMetaCompact(jsonObject) {
  try {
    if (typeof jsonObject === 'string') {
      jsonObject = JSON.parse(jsonObject);
    }

    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return {};
    }

    function getCompactMeta(obj) {
      const meta = {};
      
      for (const [key, value] of Object.entries(obj)) {
        let type = typeof value;
        
        if (value === null) {
          meta[key] = 'null';
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            const firstElement = value[0];
            const elementType = typeof firstElement;
            if (elementType === 'object' && firstElement !== null) {
              meta[key] = `array[${Array.isArray(firstElement) ? 'array' : 'object'}]`;
            } else {
              meta[key] = `array[${elementType}]`;
            }
          } else {
            meta[key] = 'array[]';
          }
        } else if (value instanceof Date) {
          meta[key] = 'date';
        } else if (type === 'object') {
          meta[key] = getCompactMeta(value);
        } else if (type === 'number') {
          meta[key] = Number.isInteger(value) ? 'integer' : 'float';
        } else {
          meta[key] = type;
        }
      }
      
      return meta;
    }
    
    return getCompactMeta(jsonObject);
  } catch (error) {
    console.error('Error in getMetaCompact:', error);
    return {};
  }
}

function getPartial(jsonObject, attributes) {
  try {
    if (typeof jsonObject === 'string') {
      jsonObject = JSON.parse(jsonObject);
    }

    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return {};
    }
    
    const result = {};

    if (Array.isArray(attributes)) {
      for (const attr of attributes) {
        if (attr in jsonObject) {
          result[attr] = jsonObject[attr];
        }
      }
    }
    else if (typeof attributes === 'string') {
      if (attributes in jsonObject) {
        result[attributes] = jsonObject[attributes];
      }
    }
    else if (typeof attributes === 'object' && attributes !== null) {
      for (const [newKey, originalKey] of Object.entries(attributes)) {
        if (originalKey in jsonObject) {
          result[newKey] = jsonObject[originalKey];
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in getPartial:', error);
    return {};
  }
}

function getPartialDeep(jsonObject, attributePaths) {
  try {
    if (typeof jsonObject === 'string') {
      jsonObject = JSON.parse(jsonObject);
    }

    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return {};
    }
    
    const result = {};

    function getValueFromPath(obj, path) {
      const parts = path.split('.');
      let current = obj;
      
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      }
      
      return current;
    }

    if (Array.isArray(attributePaths)) {
      for (const path of attributePaths) {
        const value = getValueFromPath(jsonObject, path);
        if (value !== undefined) {
          const key = path.split('.').pop();
          result[key] = value;
        }
      }
    }
    else if (typeof attributePaths === 'object' && attributePaths !== null) {
      for (const [newKey, path] of Object.entries(attributePaths)) {
        const value = getValueFromPath(jsonObject, path);
        if (value !== undefined) {
          result[newKey] = value;
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in getPartialDeep:', error);
    return {};
  }
}

function getPartialWithDefaults(jsonObject, attributesConfig) {
  try {
    if (typeof jsonObject === 'string') {
      jsonObject = JSON.parse(jsonObject);
    }

    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return {};
    }
    
    const result = {};

    function getValueFromPath(obj, path, defaultValue) {
      const parts = path.split('.');
      let current = obj;
      
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return defaultValue;
        }
      }
      
      return current;
    }

    for (const [outputKey, config] of Object.entries(attributesConfig)) {
      if (typeof config === 'string') {
        result[outputKey] = getValueFromPath(jsonObject, config, undefined);
      } else if (typeof config === 'object' && config !== null) {
        const path = config.path || outputKey;
        const defaultValue = config.default;
        let value = getValueFromPath(jsonObject, path, defaultValue);

        if (config.transform && typeof config.transform === 'function') {
          value = config.transform(value);
        }
        
        result[outputKey] = value;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in getPartialWithDefaults:', error);
    return {};
  }
}

function excludeAttributes(jsonObject, attributesToExclude) {
  try {
    if (typeof jsonObject === 'string') {
      jsonObject = JSON.parse(jsonObject);
    }

    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return {};
    }
    
    const result = { ...jsonObject };

    if (Array.isArray(attributesToExclude)) {
      for (const attr of attributesToExclude) {
        delete result[attr];
      }
    }
    else if (typeof attributesToExclude === 'string') {
      delete result[attributesToExclude];
    }
    
    return result;
  } catch (error) {
    console.error('Error in excludeAttributes:', error);
    return {};
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
  getAttributes,
  getMeta,
  getMetaDetail,
  getMetaCompact,
  getPartial,
  getPartialDeep,
  getPartialWithDefaults,
  excludeAttributes,
};
