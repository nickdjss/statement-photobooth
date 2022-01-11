const environment = "prod"; //"prod" or "dev";
const drive = require('./drive-auth-upload.js');
const display = require('./display.js');
const fs = require('fs');
const uuidv4 = require('uuid');
const PiCamera = require('pi-camera');
const readline = require('readline');
const keyboard = 'keyboard-handler'

  
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const myCamera = new PiCamera({
  mode: 'photo',
  output: `${ __dirname }/photos/download.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
});

const upload = function(photoFileName, textResponses){
	return new Promise(function(resolve, reject){
		fs.readFile('credentials.json', (err, content) => {
			if (err) {reject(Error(err))};
			// Authorize a client with credentials, then call the Google Drive API.
			drive.authorize(JSON.parse(content), drive.uploadFile, photoFileName, textResponses).then(result =>{ 
			//console.log(result);
			resolve('success');
			});
		});
	});
};


  
  
if(environment == "prod"){
	let submit = false;
	
	while(!submit){
keyboard.keyPressed(e => {
  console.log(e.which)
})
	}
	//display.updateText("what is your name");
	let answer = "";
	
	
	//display.updateText(name);
	 
	  
	//console.log("taking a photo");
	 /*myCamera.snap()
  .then((result) => {
    console.log("image taken")
		let uuid = uuidv4.v4(); 
		let photoFileName = uuid += ".jpg";
		let textResponses = [
    'my name is:',name,"my file is: ",photoFileName
  ];
	upload(photoFileName, textResponses).then(result => recursiveAsyncReadLine());
    // Your picture was captured
  })
  .catch((error) => {
    console.log(error);
     // Handle your error
  });
  });
  */

//}
///recursiveAsyncReadLine(); //Calling this function again to ask new question
}

if(environment == "dev"){
	var recursiveAsyncReadLine = function () {
		rl.question('What is your name?', function (name) {
			if (name == 'exit'){ //we need some base case, for recursion
				return rl.close(); //closing RL and returning from function.
			}
			console.log("taking a photo");
			let uuid = uuidv4.v4(); 
			let photoFileName = uuid += ".jpg";
			let textResponses = ['my name is:',name,"my file is: ",photoFileName];
			upload(photoFileName, textResponses).then(result => recursiveAsyncReadLine());
		});

}
recursiveAsyncReadLine(); //Calling this function again to ask new question
};
  
