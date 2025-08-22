const http = require('http');
const port = process.env.PORT || 3000;
const http = require('http');
process.env.ENVIRONMENT = 'production';3000;

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});d(200, {'Content-Type': 'text/plain'});
    res.end('Hello from ' + process.env.ENVIRONMENT + ' environment!\n');    res.end('Hello from ' + process.env.ENVIRONMENT + ' environment!\n');
}).listen(port);




console.log('Server running on port', port);console.log('Server running on port', port);