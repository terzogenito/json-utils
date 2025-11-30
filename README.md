# Documentation

## Overview
This module provides various functions for reading, validating, and processing JSON files and URL content.

## Function List

### 1. `getData(path)`
```javascript
console.log(await app.getData('./test-data.json'));
```

**Description**: Reads and returns data from a file asynchronously.

**Parameters**:
- `path` (String): Path to the file to be read

---

### 2. `getString(path)`
```javascript
console.log(app.getString('test-data.json'));
```

**Description**: Reads a file and returns its content as a string.

**Parameters**:
- `path` (String): Path to the file to be read

---

### 3. `getFile(path, callback)`
```javascript
app.getFile('test-data.json', data => {
    console.log(app.isValid(data));
});
```

**Description**: Reads a file and processes the data using a callback function.

**Parameters**:
- `path` (String): Path to the file to be read
- `callback` (Function): Function to be called with the file data

---

### 4. `isValid(data)`
```javascript
app.getFile('test-data.json', data => {
    console.log(app.isValid(data));
});
```

**Description**: Validates whether the data is valid JSON.

**Parameters**:
- `data` (Any): Data to be validated

---

### 5. `toString(data)`
```javascript
app.getFile('test-data.json', data => {
    console.log(app.toString(data));
});
```

**Description**: Converts JSON data to a string.

**Parameters**:
- `data` (Object): JSON data to be converted

---

### 6. `readJSON(jsonString)`
```javascript
console.log(app.readJSON('{"name":"John","age":30,"isActive":true}'));
```

**Description**: Reads and parses a JSON string into a JavaScript object.

**Parameters**:
- `jsonString` (String): JSON string to be parsed

---

### 7. `isJSON(jsonString)`
```javascript
console.log(app.isJSON('{"name":"John","age":30,"isActive":true}'));
```

**Description**: Checks if a string is valid JSON.

**Parameters**:
- `jsonString` (String): String to be checked

---

### 8. `isJSONObject(obj)`
```javascript
console.log(app.isJSONObject({"name": "John","age": 30,"isActive": true}));
```

**Description**: Checks if an object is a valid JSON object.

**Parameters**:
- `obj` (Object): Object to be checked

---

### 9. `beautifyJSON(jsonString, indent)`
```javascript
console.log(app.beautifyJSON(jsonString));
console.log(app.beautifyJSON(jsonString, 4));
```

**Description**: Formats a JSON string with customizable indentation.

**Parameters**:
- `jsonString` (String): JSON string to be formatted
- `indent` (Number, optional): Number of spaces for indentation (default: 2)

---

### 10. `beautify(jsonObject)`
```javascript
console.log(app.beautify(sampleJSONObject));
```

**Description**: Formats a JSON object into a readable string.

**Parameters**:
- `jsonObject` (Object): JSON object to be formatted

---

### 11. `getURL(url, callback)`
```javascript
app.getURL("https://example.com/data.txt", data => {
    console.log(data);
});
```

**Description**: Fetches string content from a URL.

**Parameters**:
- `url` (String): Target URL
- `callback` (Function): Callback function that receives the data

---

### 12. `getJSON(url, callback)`
```javascript
app.getJSON("https://example.com/data.json", data => {
    console.log(data);
});
```

**Description**: Fetches and parses JSON content from a URL.

**Parameters**:
- `url` (String): URL pointing to JSON file
- `callback` (Function): Callback function that receives JSON data

## Usage Examples

```javascript
const app = require('./index');

// Reading local file
const data = await app.getData('./data.json');

// Validating JSON
const isValid = app.isJSON('{"key": "value"}');

// Formatting JSON
const beautified = app.beautifyJSON('{"key":"value"}', 4);

// Fetching data from URL
app.getJSON("https://api.example.com/data", jsonData => {
    console.log(jsonData);
});
```

## Installation
```bash
npm install @terzogenito/json-utils
```

## Requirements
- Node.js 12 or higher
- Internet connection (for URL functions)