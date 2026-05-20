const { error } = require('console');

const fs = require('fs').promises

// async function readFile(path) {
//     try {
//         const data = await fs.readFile('rext', 'utf-8')
//         console.log("File Contents: \n", data)
//     } catch (error) {
//         console.error("Error during reading file: ", error)
//         throw error;
//     }

// }

async function readFile(path) {
    const data = await fs.readFile('../read_file_async/file.txt', 'utf-8')
    console.log("File Contents: \n", data)
}

readFile('../read_file_async/file.txt').catch(error => console.log(error.message))