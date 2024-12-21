const app = require('./index');

var sampleData = '{"name":"John","age":30,"isActive":true}';

(async () => {
  console.log(await app.getData('./data.json'));
})();

app.getFile('data.json',data=>{
	console.log(app.isValid(data));
});

app.getJSON('data.json',data=>{
	console.log(app.toString(data));
});

console.log(app.readJSON(sampleData));

console.log(app.isJSON(sampleData));

console.log(app.beautifyJSON(sampleData));
console.log(app.beautifyJSON(sampleData, 4));

const sampleURL = "https://sample-files.com/downloads/documents/xml/basic-structure.xml";

app.getURL(sampleURL, data => {
	console.log(data);
});

const sampleURL = "https://filesamples.com/samples/code/json/sample1.json";

app.getJSON(sampleURL,data=>{
	console.log(app.toString(data));
});
