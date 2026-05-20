const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const success = Math.random() > 0.5;

        if (success) {
            resolve('Operation completed successfully')
        } else {
            reject(new Error('Operation failed'))
        }
    }, 1000)
});

promise
    .then(result => console.log('Success: ', result))
    .catch(error => console.log('Error: ', error.message))   
