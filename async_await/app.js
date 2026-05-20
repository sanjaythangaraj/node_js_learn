async function getData() {
    console.log("getData Starting..")
    const result = await returnsAPromise();
    console.log('Result: ', result)
    return result

}


function returnsAPromise() {
    // resolves after a second
    return new Promise((resolve, reject) => {

        // reject(new Error("Operation Failed"))
        setTimeout(() => resolve('Operation completed'), 1000);
    });
}

getData().then(data => console.log('Final data ', data)).catch(error => console.log("Error: ", error.message))