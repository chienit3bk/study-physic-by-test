const http = require('http');
const app = require('./server/index.js');

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Listen to port 3000, well actually 4000');
});
