# Documentation

## Overview
This module provides various functions for reading, validating, and processing JSON files and URL content.

## Installation
```bash
npm install @terzogenito/json-utils
```

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

### 13. getAttributes(jsonObject)
```javascript
const dataJSON = app.readJSON(data);
const attributes = app.getAttributes(dataJSON);
// Output: ['name', 'age', 'isActive', 'address', 'hobbies']
```

**Description**: Extracts all attribute/keys from a JSON object and returns them as an array.

**Parameters**:
- jsonObject (Object|String): JSON object or JSON string

Returns: Array of attribute names

### 14. getMeta(jsonObject)
```javascript
const meta = app.getMeta(dataJSON);
// Output: {"name": "string", "age": "integer", "isActive": "boolean"}
```

**Description**: Generates metadata showing attribute names and their data types.

**Parameters**:
- jsonObject (Object|String): JSON object or JSON string

Returns: Object with attribute names as keys and data types as values

Data Types Identified:
- string, integer, float, boolean, array, object, null, date

### 15. getMetaDetail(jsonObject)
```javascript
const metaDetail = app.getMetaDetail(dataJSON);
// Output: Detailed metadata including nested structures
```

**Description**: Generates comprehensive metadata including nested attributes, data types, paths, and structural information.

**Parameters**:
- jsonObject (Object|String): JSON object or JSON string

Returns: Object with detailed metadata for each attribute

Metadata Includes:
- type: Data type
- isRequired: Whether attribute exists
- path: Full path to attribute
- children: Nested attributes (for objects)
- length: Array length (for arrays)
- elementType: Type of array elements

### 16. getMetaCompact(jsonObject)
```javascript
const metaCompact = app.getMetaCompact(dataJSON);
// Output: Compact metadata format
```

**Description**: Creates a compact metadata representation showing the structure hierarchy.

**Parameters**:
- jsonObject (Object|String): JSON object or JSON string

Returns: Compact representation of JSON structure

Format Examples:
- "array[string]": Array of strings
- "array[object]": Array of objects
- Nested objects shown as nested objects

### 17. getPartial(jsonObject, attributes)
```javascript
const partial = app.getPartial(dataJSON, ["name", "age"]);
// Output: {"name": "John", "age": 30}
```

**Description**: Extracts specific attributes from a JSON object.

**Parameters**:
- jsonObject (Object|String): JSON object or JSON string
- attributes (Array|String|Object): Attributes to extract

attribute Parameter Types:
- Array: List of attribute names to extract
```javascript
app.getPartial(data, ["name", "age"])
```
- String: Single attribute name
```javascript
app.getPartial(data, "name")
```
- Object: Mapping of new names to original attributes
```javascript
app.getPartial(data, {"fullName": "name", "yearsOld": "age"})
```

Returns: Object containing only the specified attributes

### 18. getPartialDeep(jsonObject, attributePaths)
```javascript
const deepPartial = app.getPartialDeep(dataJSON, ["name", "address.city", "hobbies.length"]);
// Output: {"name": "John", "city": "Jakarta", "length": 2}
```

**Description**: Extracts attributes using nested paths (dot notation).

**Parameters**:
- jsonObject (Object|String): JSON object or JSON string
- attributePaths (Array|Object): Paths to extract

attributePaths Parameter Types:
- Array: List of dot-notated paths
```javascript
app.getPartialDeep(data, ["user.profile.name", "user.contact.email"])
```
- Object: Mapping of new names to paths
```javascript
app.getPartialDeep(data, {"userName": "user.profile.name", "userEmail": "user.contact.email"})
```

Returns: Object with extracted values (uses last path segment as key for array input)

### 19. getPartialWithDefaults(jsonObject, attributesConfig)
```javascript
const partialWithDefaults = app.getPartialWithDefaults(dataJSON, {
"name": "name",
"status": {
path: "isActive",
transform: (val) => val ? "Active" : "Inactive"
},
"email": {
path: "contact.email",
default: "no-email@example.com"
}
});
```

**Description**: Extracts attributes with advanced configuration including default values and transformations.

**Parameters**:
- jsonObject (Object|String): JSON object or JSON string
- attributesConfig (Object): Configuration object

Configuration Options:
- String: Simple path extraction
```javascript
"name": "user.fullName"
```
- Object: Advanced configuration
```javascript
"formattedAge": {
path: "age", // Required: Path to attribute
default: 0, // Optional: Default value if path doesn't exist
transform: (val) => ${val} years old // Optional: Transformation function
}
```

Returns: Object with extracted and processed values

### 20. excludeAttributes(jsonObject, attributesToExclude)
```javascript
const filtered = app.excludeAttributes(dataJSON, ["isActive", "address"]);
// Output: {"name": "John", "age": 30, "hobbies": ["reading", "coding"]}
```

**Description**: Creates a new JSON object excluding specified attributes.

**Parameters**:
- jsonObject (Object|String): JSON object or JSON string
- attributesToExclude (Array|String): Attributes to remove

attributesToExclude Parameter Types:
- Array: List of attribute names to exclude
```javascript
app.excludeAttributes(data, ["password", "secretKey"])
```
- String: Single attribute name to exclude
```javascript
app.excludeAttributes(data, "password")
```

Returns: New object without the excluded attributes

### 21. getAttributeValue(jsonObject, attributeName, defaultValue)
```javascript
const name = app.getAttributeValue(dataJSON, "name");
const email = app.getAttributeValue(dataJSON, "email", "default@email.com");
```

**Description**: Gets the value of a specific attribute with optional default value.

**Parameters**:
- jsonObject (Object|String): JSON object or JSON string
- attributeName (String): Name of the attribute to retrieve
- defaultValue (Any, optional): Default value if attribute doesn't exist

Returns: Attribute value or default value

Advanced Usage Examples
```javascript
const app = require('./index');

// Get all attributes from JSON
const data = await app.getData('./data.json');
const jsonData = app.readJSON(data);
const attributes = app.getAttributes(jsonData);

// Get metadata information
const meta = app.getMeta(jsonData);
const metaDetail = app.getMetaDetail(jsonData);

// Extract specific data
const userInfo = app.getPartial(jsonData, ["name", "email", "phone"]);
const nestedData = app.getPartialDeep(jsonData, ["user.profile.name", "user.contact.email"]);

// Extract with transformations and defaults
const processedData = app.getPartialWithDefaults(jsonData, {
"fullName": "user.name",
"ageFormatted": {
path: "user.age",
transform: (age) => ${age} years old
},
"country": {
path: "user.address.country",
default: "Unknown"
}
});

// Exclude sensitive information
const safeData = app.excludeAttributes(jsonData, ["password", "ssn", "creditCard"]);

// Analyze complex nested structures
const complexMeta = app.getMetaDetail(complexJSON);
console.log(complexMeta.user?.children?.contact?.children?.email?.type); // "string"

// Get single attribute value
const userName = app.getAttributeValue(jsonData, "name");
const userEmail = app.getAttributeValue(jsonData, "email", "no-email@example.com");
```

## Requirements
- Node.js 12 or higher
- Internet connection (for URL functions)