const path = require('path')

const filename = path.basename('wrkspc/node/node_js/promise_chaining/app.js')
console.log(filename)

const filenameNoExt = path.basename('wrkspc/node/node_js/promise_chaining/app.js', '.js')
console.log(filenameNoExt)

console.log("Current Directory Name: ", __dirname);

console.log("File name: ", __filename)

const configFilePath = path.join(__dirname, 'config', 'app-config.json')
console.log("Config File path: ", configFilePath)

const directory_name = path.dirname(__filename)
console.log("Directory name using path.dirname(): ", directory_name)