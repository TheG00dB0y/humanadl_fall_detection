const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const uploadRouter = require('./routes/uploadRouter');
const hostname = '127.0.0.1';
const port = 80;

const app = express();
app.use(morgan('dev'));
// app.use(bodyParser.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended:true}));
app.use('/uploadimg',uploadRouter);



app.use(express.static(__dirname+ '/public')); //Serving static HTML files

app.use((req,res,next) => {
    // console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is Express Server</h1></body></html>');
});
const server = http.createServer(app);
server.listen(port,hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});