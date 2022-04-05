var http = require('http');
var fs = require('fs');

//read csv file at start
// Json read files source="https://www.geeksforgeeks.org/how-to-convert-csv-to-json-file-having-comma-separated-values-in-node-js/"
// name: "How to Convert CSV to JSON file having Comma Separated values in Node.js ?"
csv = fs.readFileSync("./data/grades.csv");
var csvArray = csv.toString().split("\r");
let result = [];
let headers = csvArray[0].split(", ")

for(let i = 1; i< csvArray.length - 1; i++){
    let obj = {}

    let str = csvArray[i]
    let newStr = ''

    let flag = 0
    for (let char of str){
        if(char === '"' && flag === 0){
            flag = 1
        }
        else if(char === '"' && flag === 1)
        {
            flag = 0
        }

        if (char === ', ' && flag === 0){
            char = '|'
        } 

        if (char !== '"'){
            newStr += char
        }
    }

    let properties = s.split("|")

    for (let j in headers){
        if (properties[j].includes(", ")){
            obj[headers[j]] = properties[j].split(", ").map(item => item.trim())
        }
        else{
            obj[headers[j]] = properties[j]
        }

        result.push(obj)
    }
}

let json = JSON.stringify(result);
// write json to file. Don't use. 
fs.writeFileSync('output.json', json);

// http.createServer(function (req, res)){

// }