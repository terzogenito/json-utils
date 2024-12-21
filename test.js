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
