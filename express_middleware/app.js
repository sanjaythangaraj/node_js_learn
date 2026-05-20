const express = require("express")
var cookieParser = require('cookie-parser')

const app = express()

const myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
}

const requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
}

function externalFunction() {
    new Promise((resolve => {
        setTimeout(() => {
            console.log("Returning Response...")
            resolve()
        }, 2000)
    }))
}

async function cookieValidator(req, res, next) {
    await externalFunction()
    next()
}

app.use(myLogger)

app.use(requestTime)

app.use(cookieParser())

app.use(cookieValidator)


app.get('/', (req, res) => {
    let responseText = 'Hello World!<br>'
    responseText += `<small>Requested at: ${req.requestTime}</small>`;

    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)

    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)

    res.send(responseText)
})

app.listen(8080, () => {
    console.log(`Server listening at http://localhost:8080`)
})