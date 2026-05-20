const http = require('http')

function requestListener(request, response) {
    console.log(request.url, request.method);

    response.writeHead(200, {
        'Content-Type': 'text/plain',
    })
    response.end('Hello World')
}

server = http.createServer(requestListener)

server.listen(8080)