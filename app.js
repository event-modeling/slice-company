const http = require('http');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    if (parsedUrl.pathname === './add-work' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            const postData = querystring.parse(body);
            if ('hours' in postData) {
                // The field 'hours' exists in the POST data
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Hours field exists');
            } else {
                // The field 'hours' does not exist in the POST data
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Hours field does not exist');
            }
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});
console.log("running server");
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
