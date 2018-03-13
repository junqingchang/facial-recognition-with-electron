var enabled = true; // A flag to know when start or stop the camera
var WebCamera = require("webcamjs"); // Use require to add webcamjs
WebCamera.attach('camdemo');
// document.getElementById("start").addEventListener('click', function () {
//     if (!enabled) { // Start the camera !
//         enabled = true;
//         WebCamera.attach('camdemo');
//         console.log("The camera has been started");
//     } else { // Disable the camera !
//         enabled = false;
//         WebCamera.reset();
//         console.log("The camera has been disabled");
//     }
// }, false);

var app = require('electron').remote; 
var dialog = app.dialog;

var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

// return an object with the processed base64image
function processBase64Image(dataString) {
    var response = ''
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

// document.getElementById("savefile").addEventListener('click', function () {
//     if (enabled) {
//         WebCamera.snap(function (data_uri) {
//             // Save the image in a variable
//             var imageBuffer = processBase64Image(data_uri);
//             // Start the save dialog to give a name to the file
//             dialog.showSaveDialog({
//                 filters: [
//                     { name: 'Images', extensions: ['jpg'] },
//                 ]
//             }, function (fileName) {
//                 if (fileName === undefined) {
//                     console.log("You didn't save the file because you exit or didn't give a name");
//                     return;
//                 }   
//                 // If the user gave a name to the file, then save it
//                 // using filesystem writeFile function
//                 fs.writeFile(fileName, imageBuffer.data, function(err){
//                     if (err) {
//                         console.log("Cannot save the file :'( time to cry !");
//                     } else {
//                         alert("Image saved succesfully");
//                     }
//                 });
//             });
//         });
//     } else {
//         console.log("Please enable the camera first to take the snapshot !");
//     }
// }, false);

// document.getElementById("verify").addEventListener('click', function () {
//     dialog.showMessageBox({ message: 'test', buttons: ['OK'] });
// }, false);