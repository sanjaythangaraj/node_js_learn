const fs = require('fs');

console.log("REading File...")

data = fs.readFileSync('../read_file_async/file.txt', 'utf-8')

console.log("File Content: \n", data)