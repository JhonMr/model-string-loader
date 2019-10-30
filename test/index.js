var fs = require('fs'),  
	analyzeCode = require('../src'); 
var filename = './test/module.js'
var source = fs.readFileSync(filename, 'utf-8'); 	
var obj = analyzeCode(source);  
console.log(obj); 
console.log('Finish !');