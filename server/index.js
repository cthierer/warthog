var http = require('http'),
    https = require('https'),
    url = require('url'),
    server;

server = http.createServer(function (req, res) {
    var reqParts = url.parse(req.url),
        proxyReq;

    // allow CORS pre-flight checks
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:8080',
            'Access-Control-Allow-Headers': 'X-APIToken'
        });

        res.end();
        return;
    }

    // if not a pre-flight check, then proxy request to remote API
    proxyReq = https.request({
        hostname: 'www.haloapi.com',
        path: reqParts.href,
        headers: {
            'Ocp-Apim-Subscription-Key': req.headers['x-apitoken']
        }
    }, function (proxyRes) {
        var body = '';

        proxyRes.on('data', function (data) {
            body += data;
        });

        proxyRes.on('end', function () {
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:8080',
                'Access-Control-Allow-Headers': 'X-APIToken'
            });

            res.write(body);
            res.end();
        });
    }).on('error', function (e) {
        res.writeHead('500', {
            'Content-Type': 'text/plain'
        });

        res.end(e.toString());
    });

    proxyReq.end();
});

module.exports = server;
