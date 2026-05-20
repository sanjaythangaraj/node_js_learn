const http = require('http')
const req = http.get('http://nonexistent-site.com', (res) => { });
req.on('error', (err) => {
    console.error(err.code)
})