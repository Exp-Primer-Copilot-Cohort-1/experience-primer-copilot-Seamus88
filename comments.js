

// Create web server
var http = require('http');
var fs = require('fs');
var qs = require('querystring');

// Create a server
var server = http.createServer(function (req, res) {
    if (req.method === 'GET') {
        // GET request
        if (req.url === '/comments') {
            fs.readFile('comments.json', function (err, data) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end('Server error');
                    return;
                }

                res.end(data);
            });
        } else {
            fileServer(req, res);
        }
    } else if (req.method === 'POST') {
        // POST request
        if (req.url === '/comments') {
            var body = '';

            req.on('data', function (chunk) {
                body += chunk;
            });

            req.on('end', function () {
                var comment = qs.parse(body);

                fs.readFile('comments.json', function (err, data) {
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        res.end('Server error');
                        return;
                    }

                    var comments = JSON.parse(data);
                    comments.push(comment);

                    fs.writeFile('comments.json', JSON.stringify(comments), function (err) {
                        if (err) {
                            console.error(err);
                            res.statusCode = 500;
                            res.end('Server error');
                            return;
                        }

                        res.end();
                    });
                });
            });
        } else {
            fileServer(req, res);
        }
    }
});

function fileServer(req, res) {
    fs.readFile(req.url.substring(1), function (err, data) {
        if (err) {
            console.error(err);
            res.statusCode = 404;
            res.end('File not found');
            return;
        }

        res.end(data);
    });
}

server.listen(3000, function () {
    console.log('Server is listening on port 3000');
});