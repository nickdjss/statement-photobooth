const environment = "dev"; //"prod";
const drive = require('./drive-auth-upload.js');
const fs = require('fs');
const uuidv4 = require('uuid');
const PiCamera = require('pi-camera');

const myCamera = new PiCamera({
  mode: 'photo',
  output: `${ __dirname }/photos/download.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
});

 const some_function = function(photoFileName){
	return new Promise(function(resolve, reject){
  
		fs.readFile('credentials.json', (err, content) => {
			if (err) {reject(Error(err))};
			// Authorize a client with credentials, then call the Google Drive API.
			drive.authorize(JSON.parse(content), drive.uploadFile, photoFileName).then(result =>{ 
			console.log(result);
			resolve('success');
			});
			
		});
	});
};
 


if(environment == "prod"){
 myCamera.snap()
  .then((result) => {
    console.log("image taken")
	let uuid = uuidv4.v4(); 
	let photoFileName = uuid += ".jpg";
	some_function(photoFileName);
    // Your picture was captured
  })
  .catch((error) => {
    console.log(error);
     // Handle your error
  });
}

if(environment == "dev"){
	let uuid = uuidv4.v4(); 
	let photoFileName = uuid += ".jpg";
	some_function(photoFileName).then(result => console.log(result));
}
  
