const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the given callback function.
 */
function authorize(credentials, callback, filename, textResponses) {
	return new Promise(function(resolve, reject){
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, filename, textResponses);
	resolve("authorized");
  });
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}
/**
* Describe with given media and metaData and upload it using google.drive.create method()
*/ 
function uploadFile(auth, filename, textResponses) {
	updateSheet(auth, filename, textResponses);
	return new Promise(function(resolve, reject){
  const drive = google.drive({version: 'v3', auth});
  
  const fileMetadata = {
    'name': filename,
	parents: ['1FufljJu_GMJqHEBYo5aUm3eLuK0p5O22']
	
  };
  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream("photos/download.jpg")
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, (err, file) => {
    if (err) {
      // Handle error
      reject(err);
    } else {
      resolve('File Id: ', file.data.id);
    }
  });
	});
}

function updateSheet(auth, filename, textResponses) {
  const sheets = google.sheets({version: 'v4', auth});
  let values = [
  textResponses,
  // Additional rows ...
];
let resource = {
  values,
};

   const request = {
    spreadsheetId: '1JONIKWL88rdcTxl1IvXj0Wcm-YIHccbpemluk210moo', 
    range: 'Sheet1!A2:E11',
    // How the input data should be interpreted.
    valueInputOption: '',  // TODO: Update placeholder value.

    // How the input data should be inserted.
    insertDataOption: '',  // TODO: Update placeholder value.

    resource: {
      values,
    },

    auth: auth,
  };

sheets.spreadsheets.values.append({
  spreadsheetId:'1JONIKWL88rdcTxl1IvXj0Wcm-YIHccbpemluk210moo',
  range:'Sheet1',
 valueInputOption:'RAW',
  resource:resource,
}, (err, result) => {
  if (err) {
    // Handle error.
    console.log(err);
  } else {
    console.log(`${result}`);
  }
});
  
  /*
  sheets.spreadsheets.values.get({
    spreadsheetId: '1JONIKWL88rdcTxl1IvXj0Wcm-YIHccbpemluk210moo',
    range: 'Sheet1!A2:E11',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      console.log('Name, Major:');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[4]}`);
      });
    } else {
      console.log('No data found.');
    }
  });
  */
}


module.exports = {uploadFile, authorize, updateSheet}