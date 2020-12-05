const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const uploadRouter = express.Router();

// uploadRouter.use(bodyParser.json());
// uploadRouter.use(bodyParser.json({limit: '100mb', extended: true}))
// uploadRouter.use(bodyParser.urlencoded({limit: '100mb', extended: true}))

uploadRouter.use(express.json({limit: '50mb'}));
uploadRouter.use(express.urlencoded({limit: '50mb',extended: true}));
uploadRouter.route('/')
.all((req,res,next) => {
    console.log("Recieved Wrong");
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Image file missing');

});

uploadRouter.route('/:name')
.all((req,res,next) => {
    // console.log("Recieved in all");
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /uploadimg');
})
.post((req, res, next) => {
    console.log("Recieved in POST");
    // Date formatting
    // const timeElapsed = Date.now();
    // const today = new Date(timeElapsed);
    // file_name = today.toUTCString() + '_img.png';
    // file_name = "new.png"
    var today = new Date(),
        time = today.toTimeString().split(':').join('').substr(0, 6),
        dte = today,
        d = dte.getDate().toString(),
        m = (dte.getMonth() + 1).toString(),
        yyyy = dte.getFullYear().toString(),
        dd = (d.length < 2) ? '0' + d : d,
        mm = (m.length < 2) ? '0' + m : m,
        yy = yyyy.substring(2, 4);
    //Use required date format
    file_name = req.params.name +'_'+ dd + '_' + mm + '_' + yyyy + '_' +time + '.png';
    console.log(file_name); 

    var json = req.body;
    base64String = json.image;
    let base64Image = base64String.split(';base64,').pop();
    // Saving the file in server
    fs.writeFile('./snaps_saved/'+ file_name, base64Image, {encoding: 'base64'}, function(err) {
        if(err == null){
            res.end('(Response from server) <br/> File_name format: Snap/Class_dd_mm_yyyy_time<br\>' + req.params.name + ' image is saved as :' + file_name);
        }
        else{
            console.log(err);
            res.end('(Response from server) File Name: ' + req.params.name + 'Error saving');
        }
    });

    

});

module.exports = uploadRouter;
