const app = require('./index');

/* test 1 : read a file */
console.log('test 1 : read a file');
(async () => {
  console.log(await app.getData('./test-data.json'));
})();
console.log(app.getString('test-data.json'));

/* test 2 : get and process a file data (check validation) */
console.log('test 2 : get and process a file data (check validation)');
app.getFile('test-data.json',data=>{
	console.log(app.isValid(data));
});

/* test 3 : json to string */
console.log('test 3 : json to string');
app.getFile('test-data.json',data=>{
	console.log(app.toString(data));
});

var sampleJSONString = '{"name":"John","age":30,"isActive":true}';

/* test 4 : read json from json string */
console.log('test 4 : read json from json string');
console.log(app.readJSON(sampleJSONString));

/* test 5 : check json string validation */
console.log('test 5 : check json string validation');
console.log(app.isJSON(sampleJSONString));

var sampleJSONObject = {"name": "John","age": 30,"isActive": true};

/* test 6 : check json object validation */
console.log('test 6 : check json object validation');
console.log(app.isJSONObject(sampleJSONObject));

/* test 7 : beautify json string with custom indent */
console.log('test 7 : beautify json string with custom indent');
console.log(app.beautifyJSON(sampleJSONString));
console.log(app.beautifyJSON(sampleJSONString, 4));

/* test 8 : beautify json object */
console.log('test 8 : beautify json object');
console.log(app.beautify(sampleJSONObject));

/* test 9 : get string content from url */
console.log('test 9 : get string content from url');
const sampleTextURL = "https://sample-files.com/downloads/documents/txt/simple.txt";
app.getURL(sampleTextURL, data => {
	console.log(data);
});

/* test 10 : get json content from url */
console.log('test 10 : get json content from url');
const sampleJSONURL = "https://filesamples.com/samples/code/json/sample1.json";
app.getJSON(sampleJSONURL,data=>{
	console.log(data);
});

/* test 11 : get json attributes properties */
console.log('test 11 : get json content from url');
app.getJSON(sampleJSONURL,data=>{
	console.log(app.getAttributes(data));
});

/* test 12 : get json attributes properties and data type information */
console.log('test 12 : get json content from url');
app.getJSON(sampleJSONURL,data=>{
	console.log(app.getMeta(data));
});

/* test 13 : get partial json attributes */
console.log('test 13 : get partial json attributes');
const sampleData = {
  "name": "John",
  "age": 30,
  "isActive": true,
  "address": {
    "city": "Jakarta",
    "country": "Indonesia"
  },
  "hobbies": ["reading", "coding"]
};

console.log('Original data:', sampleData);
console.log('Partial (name, age only):', app.getPartial(sampleData, ["name", "age"]));
console.log('Partial with renamed keys:', app.getPartial(sampleData, {
  "fullName": "name",
  "yearsOld": "age"
}));

/* test 14 : get partial json attributes with nested paths */
console.log('test 14 : get partial json attributes with nested paths');
console.log('Deep partial:', app.getPartialDeep(sampleData, ["name", "address.city", "hobbies.length"]));
console.log('Deep partial with mapping:', app.getPartialDeep(sampleData, {
  "userName": "name",
  "location": "address.city",
  "hobbyCount": "hobbies.length"
}));

/* test 15 : get partial with defaults and transformations */
console.log('test 15 : get partial with defaults and transformations');
console.log('Partial with defaults:', app.getPartialWithDefaults(sampleData, {
  "name": "name",
  "city": "address.city",
  "status": {
    path: "isActive",
    transform: (val) => val ? "Active" : "Inactive"
  },
  "nickname": {
    path: "nickname",
    default: "No Nickname"
  },
  "hobbyCount": {
    path: "hobbies.length",
    transform: (val) => `${val} hobbies`
  }
}));

/* test 16 : exclude attributes from json */
console.log('test 16 : exclude attributes from json');
console.log('Exclude isActive and address:', app.excludeAttributes(sampleData, ["isActive", "address"]));
console.log('Exclude age only:', app.excludeAttributes(sampleData, "age"));

/* test 17 : get attribute value from json */
console.log('test 17 : get attribute value from json');
console.log('Get name attribute:', app.getAttributeValue(sampleData, "name"));
console.log('Get non-existent attribute with default:', app.getAttributeValue(sampleData, "email", "default@email.com"));

/* test 18 : get detailed metadata with children */
console.log('test 18 : get detailed metadata with children');
console.log('Detailed metadata:', app.getMetaDetail(sampleData));

/* test 19 : get compact metadata format */
console.log('test 19 : get compact metadata format');
console.log('Compact metadata:', app.getMetaCompact(sampleData));

/* test 20 : test with real file data */
console.log('test 20 : test with real file data');
(async () => {
  const fileData = await app.getData('./test-data.json');
  if (fileData) {
    const jsonData = app.readJSON(fileData);
    
    // Get attributes
    console.log('File attributes:', app.getAttributes(jsonData));
    
    // Get partial data if file has expected structure
    if (jsonData.name || jsonData.age) {
      console.log('Partial file data:', app.getPartial(jsonData, ["name", "age"]));
    }
    
    // Get metadata
    console.log('File metadata:', app.getMeta(jsonData));
    
    // Get detailed metadata
    console.log('Detailed file metadata:', app.getMetaDetail(jsonData));
  }
})();

/* test 21 : get JSON from URL and process attributes */
console.log('test 21 : get JSON from URL and process attributes');
const sampleJSONURL2 = "https://jsonplaceholder.typicode.com/users/1";
app.getJSON(sampleJSONURL2, data => {
  if (data) {
    console.log('Fetched user data:', data);
    console.log('Partial user info:', app.getPartial(data, ["name", "email", "phone"]));
    console.log('User metadata:', app.getMeta(data));
  }
});

/* test 22 : test complex nested structure */
console.log('test 22 : test complex nested structure');
const complexData = {
  "id": 1,
  "user": {
    "personal": {
      "firstName": "John",
      "lastName": "Doe",
      "age": 30
    },
    "contact": {
      "email": "john@example.com",
      "phones": ["123-456", "789-012"]
    }
  },
  "orders": [
    {
      "id": 101,
      "items": ["item1", "item2"],
      "total": 99.99
    },
    {
      "id": 102,
      "items": ["item3"],
      "total": 49.99
    }
  ]
};

console.log('Complex data partial:', app.getPartialDeep(complexData, [
  "user.personal.firstName",
  "user.contact.email",
  "orders.length"
]));

console.log('Complex metadata:', app.getMetaDetail(complexData));

/* test 23 : test error handling */
console.log('test 23 : test error handling');
console.log('Invalid JSON string:', app.getPartial('invalid json', ["name"]));
console.log('Null input:', app.getPartial(null, ["name"]));
console.log('Undefined input:', app.getPartial(undefined, ["name"]));

/* test 24 : test with array of objects */
console.log('test 24 : test with array of objects');
const arrayData = [
  { "id": 1, "name": "John", "age": 30 },
  { "id": 2, "name": "Jane", "age": 25 },
  { "id": 3, "name": "Bob", "age": 35 }
];

// Note: getPartial works on objects, not arrays directly
console.log('First object in array:', app.getPartial(arrayData[0], ["name", "age"]));
