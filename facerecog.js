const fr = require('face-recognition');
const path = require('path');
// const fs = require('fs');
const mainPath = 'images';

const recognizer = fr.FaceRecognizer();
const detector = fr.FaceDetector();

function trainNew() {
    const numJitters = 15;
    loadModel();
    fs.readdir(mainPath, function (err, files) {
        if (err) {
            console.error("Could not list the directory", err);
            process.exit(1);
        }
        files.forEach(function (file, index) {
            var eachFolder = path.join(mainPath, file);
            var nameList = eachFolder.split('/');
            var name = nameList[nameList.length - 1];
            var holder = [];
            fs.readdir(eachFolder, function (err, files) {
                if (err) {
                    console.error("Could not access directory", err);
                    process.exit(1);
                }
                files.forEach(function (image, innerIndex) {
                    var eachFile = path.join(eachFolder, image);
                    const targetSize = 200;
                    var faceImage = detector.detectFaces(fr.loadImage(eachFile), targetSize);
                    console.log('Analyzing ' + eachFile);
                    holder.push(...faceImage);
                });
                console.log('Training for ' + name);
                recognizer.addFaces(holder, name, numJitters);
                const modelState = recognizer.serialize();
                fs.writeFileSync('model.json', JSON.stringify(modelState));
            });
        });
    });
}

function loadModel() {
    const modelState = fs.readFileSync('model.json');
    const values = JSON.parse(modelState);
    recognizer.load(values);
}

function trainSingle(singleName) {
    const numJitters = 15;
    var set = [];
    loadModel();
    fs.readdir("train", function (err, files) {
        var flag = false;
        files.forEach(function (image, innerIndex) {
            if (flag) { return; }
            var trainFile = path.join("train", image);
            const targetSize = 200;
            console.log(trainFile);
            var faceImage = detector.detectFaces(fr.loadImage(trainFile), targetSize);
            if (faceImage.length === 0) {
                flag = true;
                return;
            }
            console.log('Analyzing ' + image);
            set.push(...faceImage);
        });
        console.log('Training for ' + singleName);
        try {
            recognizer.addFaces(set, singleName, numJitters);
            const modelState = recognizer.serialize();
            fs.writeFileSync('model.json', JSON.stringify(modelState));
        } catch (err) {
            dialog.showMessageBox({ title: "Error", message: "No face detected, ensure you are looking at the camera", buttons: ['OK'] });
        }
    });
}

function predict(image) {
    loadModel();
    const load = fr.loadImage(image);
    const targetSize = 200;
    var detectedFace = detector.detectFaces(load, targetSize);
    if (detectedFace.length < 1) {
        console.log('No face detected');
    } else {
        const bestPrediction = recognizer.predictBest(detectedFace[0]);
        console.log(bestPrediction);
        console.log('Detected: ' + bestPrediction.className);
        if (bestPrediction.distance < 0.3) {
            return bestPrediction.className;
        } else {
            return 'Not able to verify';
        }

    }

}

var app = require('electron').remote;
var dialog = app.dialog;

document.getElementById("verify").addEventListener('click', function () {
    WebCamera.snap(function (data_uri) {
        // Save the image in a variable
        var imageBuffer = processBase64Image(data_uri);
        // using filesystem writeFile function
        fs.writeFile("testFiles/image.jpg", imageBuffer.data, function (err) {
            if (err) {
                console.log("Cannot save the file");
            } else {
                dialog.showMessageBox({ title: "Confirmation", message: "Verified: " + predict("testFiles/image.jpg"), buttons: ['OK'] });
            }
        });

    });
}, false);
// trainNew();

document.getElementById("submit").addEventListener('click', function () {
    const inputName = document.querySelector('#name').value;
    console.log(inputName);
    if (!(/\S/.test(inputName))) {
        dialog.showMessageBox({ title: "Error", message: "Please Enter Name", buttons: ['OK'] });
    } else {
        WebCamera.snap(function (data_uri) {
            // Save the image in a variable
            var imageBuffer = processBase64Image(data_uri);
            // using filesystem writeFile function
            fs.writeFile("train/image1.jpg", imageBuffer.data, function (err) {
                if (err) {
                    console.log("Cannot save the file");
                } else {
                    console.log("1st image saved");
                }
            });
            fs.writeFile("train/image2.jpg", imageBuffer.data, function (err) {
                if (err) {
                    console.log("Cannot save the file");
                } else {
                    console.log("2nd image saved");
                }
            });
            fs.writeFile("train/image3.jpg", imageBuffer.data, function (err) {
                if (err) {
                    console.log("Cannot save the file");
                } else {
                    console.log("3rd image saved");
                    trainSingle(inputName, function () {
                        dialog.showMessageBox({ title: "Trained", message: name + " has been added to the database", buttons: ['OK'] });
                    });
                }
            });
        });
    }
}, false);