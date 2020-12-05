// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

const canvas = document.getElementById("canvas"),
    cameraTrigger = document.querySelector("#camera--button"),
    cameraOutput = document.querySelector("#camera--output")
const hostname = '127.0.0.1';
const port = 80;

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/LxnEgSbrT/";
let model, webcam, ctx, labelContainer, maxPredictions;
var max_class,counter=0,max_score;
//Change threshold value to change the frequency in which snaps are taken on detection of an alert
var ALERT_THRESH = 5;

async function init() {

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = 600;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM



    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);


    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;

        // console.log(prediction[i].className)
        if (max_score == null || max_score < prediction[i].probability.toFixed(2) ){
            // console.log(max_score,prediction[i].probability.toFixed(2))
            max_score = prediction[i].probability.toFixed(2);
            if(max_class != null && max_class == prediction[i].className ){
                // console.log(counter,max_class)
                counter = counter +1;
                if(counter == ALERT_THRESH && prediction[i].className == "Stand"){
                    // console.log(counter)
                    // console.log(`Alert for ${max_class}`);
                    const res = document.getElementById('alert_disp');
                    res.innerHTML = `Alert for  ${max_class}`; 
                    //Drawing the pose and calling the send image function 'sendBase64ToServer'
                    drawPose(pose,alert = 1,filename_add= max_class);
                }
            }
            else{
                counter = 0;
            }
            max_class = prediction[i].className;
            // console.log(max_class,prediction[i].probability)
        }
    }
    max_score=0;
    // finally draw the poses
    drawPose(pose);
}

function drawPose(pose,alert=0,filename_add = "Snap") {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            // console.log(pose.keypoints)
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
        if(alert == 1){
            console.log("ALERT 1")
            cameraOutput.src = canvas.toDataURL("image/webp");
            data = cameraOutput.src;
            cameraOutput.classList.add("taken");
            sendBase64ToServer(filename_add,data);
        }
        // cameraTrigger.onclick = function() {
        cameraTrigger.onclick = function() {
            // canvas.width = webcam.canvas.videoWidth;
            // canvas.height = webcam.canvas.videoHeight;
            // ctx = canvas.getContext("2d");
            // canvas.getContext("2d").drawImage(webcam.canvas, 0, 0);
            cameraOutput.src = canvas.toDataURL("image/webp");
                cameraOutput.src = canvas.toDataURL("image/webp");
                // console.log(cameraOutput);
                // cameraOutput.crossOrigin = 'Anonymous'
                data = cameraOutput.src;
                cameraOutput.classList.add("taken");
                sendBase64ToServer(filename_add,data);

        };
    }
}

var sendBase64ToServer = function(filename_add, base64){
    var httpPost = new XMLHttpRequest();
    // var path = "http://127.0.0.1:3000/uploadimg/" + filename_add;
    var path = `http://${hostname}:${port}/uploadimg/${filename_add}`;
    var data = JSON.stringify({image:base64});
        httpPost.onreadystatechange = function(err) {
                if (httpPost.readyState == 4 && httpPost.status == 200){
                    console.log(httpPost.responseText);
                    const res = document.getElementById('response');
                    res.innerHTML = httpPost.responseText; 
                } else {
                    console.log("ERROR");
                    // console.log(err);
                }
            };
        // Set the content type of the request to json since that's what's being sent
        httpPost.open("POST", path, true);
        httpPost.setRequestHeader('Content-Type', 'application/json');
        httpPost.send(data);
};

// Start the video stream when the window loads
console.log("Read app.js")
window.addEventListener("load", init, false);
