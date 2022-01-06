const drive = require('./drive-auth-upload.js');
const fs = require('fs');
const uuidv4 = require('uuid');
let uuid = uuidv4.v4(); 
let photoFileName = uuid += ".jpg";

const PiCamera = require('pi-camera');
const myCamera = new PiCamera({
  mode: 'photo',
  output: `${ __dirname }/photos/image.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
});

myCamera.snap()
  .then((result) => {
    console.log("image taken")
    // Your picture was captured
  })
  .catch((error) => {
    console.log(error);
     // Handle your error
  });
  
  
  

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  drive.authorize(JSON.parse(content), drive.uploadFile, photoFileName);
  
});

