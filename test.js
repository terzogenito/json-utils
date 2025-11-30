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
console.log(app.beautifyJSON(sampleJSONString1));
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
