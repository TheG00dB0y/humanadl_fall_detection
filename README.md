# humanadl_fall_detection
An ML model which can detect some activities of daily life like Sit,Stand,Bend,Trip,Fall. Model detects human fall position take snaps at the incident and sends it to the nodejs application for storing. The model is trained using https://teachablemachine.withgoogle.com/train/pose. Do train on a different environment the model can fail on a varied data distribution.

## Installation

```
Install Nodejs 

git clone https://github.com/TheG00dB0y/humanadl_fall_detection
cd ./humanadl_fall_detection
//installing node modules
npm install 
//Running node application at 127.0.0.1 port 80
node index  
//Open a browser and send the GET request to 127.0.0.1 
```
## NOTE:
Change ALERT_THRESH value to change the frequency in which snaps are taken on detection of an alert
Currently alert is defined as "Stand" for an easy demo, do change the ALERT_CLASS to required class name (Available classes: Sit,Stand,Bend,Trip,Fall)

## Issues
Make sure to enter '127.0.0.1 ' in the browser address bar due to CORS policy error. (AJAX POST request is send to that address/server)
Chrome is not setting the img src as empty works fine with firefox
