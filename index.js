var server = require('./server');

const PORT = 8081;

server.listen(PORT, function () {
    console.log('Server started on port ' + PORT);
});
