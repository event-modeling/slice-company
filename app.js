const http = require('http');
const url = require('url');
const querystring = require('querystring');
const port = 3004;

class SliceSubmission {
    constructor(type, client, projectInput, notes, name, date, date_entered) {
        this.type = type;
        this.client = client;
        this.projectInput = projectInput;
        this.notes = notes;
        this.name = name;
        this.date = date;
        this.date_entered = date_entered;
    }
}

class HoursSubmission {
    constructor(project, hours, date, date_entered) {
        this.project = project;
        this.hours = hours;
        this.date = date;
        this.date_entered = date_entered;
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const fs = require('fs');
    const path = require('path');
    console.log("req.url", req.url)
    if (req.method === 'GET') {
        let filePath = '.' + parsedUrl.pathname;
        
        // Default to index.html if no file is specified
        if (filePath === './') {
            filePath = './index.html';
        }
        console.log("Request Method:", req.method);
        console.log("Parsed URL:", parsedUrl);
        console.log("Query String:", parsedUrl.query);
        console.log("filePath", filePath)
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end("File not found");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content, 'utf-8');
            }
        });
    } else if (parsedUrl.pathname === '/add-work' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            const postData = querystring.parse(body);
            const fs = require('fs');
            const path = require('path');
            const dirPath = path.join(__dirname, 'events');
            if (!fs.existsSync(dirPath)){
                fs.mkdirSync(dirPath, { recursive: true });
            }
            if (postData['submission-type'] === 'hours') {
                const hoursSubmission = new HoursSubmission(
                    postData['project'],
                    postData['hours'],
                    postData['date'],
                    new Date().toISOString()
                );
                const dateEnteredFormatted = new Date(hoursSubmission.date_entered).toISOString().replace(/:/g, '-').replace(/\..+/, '');
                const filePathHours = path.join(dirPath, `${dateEnteredFormatted}_hours.json`);
                fs.writeFile(filePathHours, JSON.stringify(hoursSubmission), (err) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Failed to write hours submission');
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end('Submission type is hours');
                    }
                });
            } else if (postData['submission-type'] === 'slice') {
                const sliceSubmission = new SliceSubmission(
                    postData['type'],
                    postData['client'],
                    postData['projectInput'],
                    postData['notes'],
                    postData['name'],
                    postData['date'],
                    new Date().toISOString()
                );
                const dateEnteredFormattedSlice = new Date(sliceSubmission.date_entered).toISOString().replace(/:/g, '-').replace(/\..+/, '');
                const filePathSlice = path.join(dirPath, `${dateEnteredFormattedSlice}_${sliceSubmission.constructor.name}.json`);
                fs.writeFile(filePathSlice, JSON.stringify(sliceSubmission), (err) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Failed to write slice submission');
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end('Submission type is slice');
                    }
                });
            } else {
                // The submission-type is neither hours nor slice
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Invalid submission type');
            }
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});
console.log("running server");
server.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});
