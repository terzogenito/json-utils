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

function getSize(jsonObject) {
  try {
    const jsonString = typeof jsonObject === 'string' 
      ? jsonObject 
      : JSON.stringify(jsonObject);
    return new Blob([jsonString]).size;
  } catch (error) {
    console.error('Error in getSize:', error);
    return 0;
  }
}

function sortBy(array, key, ascending = true) {
  try {
    if (!Array.isArray(array)) return array;
    
    return [...array].sort((a, b) => {
      const aValue = typeof key === 'function' ? key(a) : a[key];
      const bValue = typeof key === 'function' ? key(b) : b[key];
      
      if (aValue < bValue) return ascending ? -1 : 1;
      if (aValue > bValue) return ascending ? 1 : -1;
      return 0;
    });
  } catch (error) {
    console.error('Error in sortBy:', error);
    return array;
  }
}

function findKeys(jsonObject, keyName) {
  try {
    if (typeof jsonObject === 'string') {
      jsonObject = JSON.parse(jsonObject);
    }

    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return [];
    }

    const results = [];
    const pattern = keyName.includes('*') 
      ? new RegExp('^' + keyName.replace(/\*/g, '.*') + '$')
      : null;
    
    function search(obj, path = '') {
      if (typeof obj !== 'object' || obj === null) return;
      
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          search(item, path ? `${path}[${index}]` : `[${index}]`);
        });
      } else {
        for (const [key, value] of Object.entries(obj)) {
          const newPath = path ? `${path}.${key}` : key;
          
          const isMatch = pattern ? pattern.test(key) : key === keyName;
          if (isMatch) {
            results.push({ path: newPath, value });
          }
          
          if (typeof value === 'object' && value !== null) {
            search(value, newPath);
          }
        }
      }
    }
    
    search(jsonObject);
    return results;
  } catch (error) {
    console.error('Error in findKeys:', error);
    return [];
  }
}

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || obj1 === null || 
      typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  
  return true;
}

function diff(obj1, obj2, path = '') {
  const differences = [];
  
  if (typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null) {
    if (obj1 !== obj2) {
      differences.push({
        path,
        type: 'value',
        old: obj1,
        new: obj2
      });
    }
    return differences;
  }
  
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  
  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;
    
    if (!(key in obj1)) {
      differences.push({
        path: newPath,
        type: 'added',
        value: obj2[key]
      });
    } else if (!(key in obj2)) {
      differences.push({
        path: newPath,
        type: 'removed',
        value: obj1[key]
      });
    } else if (!deepEqual(obj1[key], obj2[key])) {
      if (typeof obj1[key] === 'object' && obj1[key] !== null &&
          typeof obj2[key] === 'object' && obj2[key] !== null) {
        differences.push(...diff(obj1[key], obj2[key], newPath));
      } else {
        differences.push({
          path: newPath,
          type: 'changed',
          old: obj1[key],
          new: obj2[key]
        });
      }
    }
  }
  
  return differences;
}

function searchValues(jsonObject, predicate) {
  try {
    if (typeof jsonObject === 'string') {
      jsonObject = JSON.parse(jsonObject);
    }

    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return [];
    }

    const results = [];
    
    function search(obj, path = '') {
      if (typeof obj !== 'object' || obj === null) {
        if (predicate(obj)) {
          results.push({ path, value: obj });
        }
        return;
      }
      
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          search(item, path ? `${path}[${index}]` : `[${index}]`);
        });
      } else {
        for (const [key, value] of Object.entries(obj)) {
          const newPath = path ? `${path}.${key}` : key;
          
          if (predicate(value)) {
            results.push({ path: newPath, value });
          }
          
          if (typeof value === 'object' && value !== null) {
            search(value, newPath);
          }
        }
      }
    }
    
    search(jsonObject);
    return results;
  } catch (error) {
    console.error('Error in searchValues:', error);
    return [];
  }
}

function findValue(jsonObject, targetValue, deep = true) {
  return searchValues(jsonObject, (value) => {
    if (typeof targetValue === 'function') {
      return targetValue(value);
    }
    return value === targetValue;
  });
}

function deepMerge(target, source) {
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return target;
  
  const output = { ...target };
  
  for (const [key, value] of Object.entries(source)) {
    if (key in target && 
        typeof target[key] === 'object' && target[key] !== null &&
        typeof value === 'object' && value !== null &&
        !Array.isArray(target[key]) && !Array.isArray(value)) {
      output[key] = deepMerge(target[key], value);
    } else {
      output[key] = value;
    }
  }
  
  return output;
}

function filterProperties(jsonObject, predicate) {
  try {
    if (typeof jsonObject === 'string') {
      jsonObject = JSON.parse(jsonObject);
    }

    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return {};
    }

    const result = {};
    
    for (const [key, value] of Object.entries(jsonObject)) {
      if (predicate(key, value)) {
        result[key] = value;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in filterProperties:', error);
    return {};
  }
}

function filterByType(jsonObject, type) {
  return filterProperties(jsonObject, (key, value) => {
    if (type === 'array') return Array.isArray(value);
    if (type === 'null') return value === null;
    if (type === 'date') return value instanceof Date;
    if (type === 'integer') return typeof value === 'number' && Number.isInteger(value);
    if (type === 'float') return typeof value === 'number' && !Number.isInteger(value);
    return typeof value === type;
  });
}

function removeEmptyProperties(jsonObject, includeEmptyStrings = false) {
  return filterProperties(jsonObject, (key, value) => {
    if (value === null || value === undefined) return false;
    if (includeEmptyStrings && value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (typeof value === 'object' && Object.keys(value).length === 0) return false;
    return true;
  });
}

function filterByKeyPattern(jsonObject, pattern) {
  const regex = new RegExp(pattern);
  return filterProperties(jsonObject, (key) => regex.test(key));
}

function toQueryString(jsonObject, prefix = '') {
  try {
    if (typeof jsonObject === 'string') {
      jsonObject = JSON.parse(jsonObject);
    }

    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return '';
    }

    const params = [];
    
    for (const [key, value] of Object.entries(jsonObject)) {
      const newKey = prefix ? `${prefix}[${key}]` : key;
      
      if (value === null || value === undefined) {
        continue;
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        params.push(toQueryString(value, newKey));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          params.push(`${newKey}[${index}]=${encodeURIComponent(item)}`);
        });
      } else {
        params.push(`${newKey}=${encodeURIComponent(value)}`);
      }
    }
    
    return params.join('&');
  } catch (error) {
    console.error('Error in toQueryString:', error);
    return '';
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
  getSize,
  sortBy,
  findKeys,
  deepEqual,
  diff,
  searchValues,
  findValue,
  deepMerge,
  filterProperties,
  filterByType,
  removeEmptyProperties,
  filterByKeyPattern,
  toQueryString
};
