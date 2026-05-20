const fs = require('fs').promises;
const promise1 = Promise.resolve('First Result')
const promise2 = new Promise((resolve) => {
    setTimeout(() => resolve('Second Promise Result'), 1000)
})
const promise3 = fs.readFile('../read_file_async/file.txt', 'utf-8');

Promise.all([promise1, promise2, promise3])
    .then(results => {
        console.log("Results: ", results);
    })
    .catch(err => console.error("Error in one of the promises", err))   