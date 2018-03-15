var assert = require('assert');

describe('Test Predict', function () {
    this.timeout(0);
    describe('#predict()', function () {
        it('should return JQ', function () {
            assert.equal(predict("testFiles/JQ.jpg"), "JQ");
        });
    });
});

describe('Test Predict', function () {
    this.timeout(0);
    describe('#predict()', function () {
        it('should return unknown', function () {
            assert.equal(predict("testFiles/unknown.jpg"), "Unknown");
        });
    });
});

describe('Test Train', function () {
    this.timeout(0);
    describe('#train()', function () {
        it('should return "Unable to train"', function (done) {
            emptyTrain("nothing",(rtn) => {
                assert.equal(rtn, "Unable to train");
                done();
            });
        });
    });
});

describe('Test Train', function () {
    this.timeout(0);
    describe('#train()', function () {
        it('should return true (i.e. array not empty)', function (done) {
            trainSingle("Chadwick", (rtn) =>{
                assert.equal(rtn, "");
                done();
            });
        });
    });
});

const fr = require('face-recognition');
const path = require('path');
const fs = require('fs');
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

function trainSingle(singleName, callback) {
    const numJitters = 15;
    var set = [];
    loadModel();
    var faceImage;
    var rtn = "";
    fs.readdir("traintest", function (err, files) {
        var flag = false;
        files.forEach(function (image, innerIndex) {
            if (flag) { return; }
            var trainFile = path.join("traintest", image);
            const targetSize = 200;
            faceImage = detector.detectFaces(fr.loadImage(trainFile), targetSize);
            if (faceImage.length === 0) {
                flag = true;
                rtn = "Unable to train";
                return;
            }
            set.push(...faceImage);
        });
        try {
            recognizer.addFaces(set, singleName, numJitters);
            const modelState = recognizer.serialize();
            fs.writeFileSync('modeltest.json', JSON.stringify(modelState));
        } catch (err) {
            dialog.showMessageBox({ title: "Error", message: "No face detected, ensure you are looking at the camera", buttons: ['OK'] });
        }
        callback(rtn);
    });
    return set;
}

function emptyTrain(singleName, callback) {
    const numJitters = 15;
    var set = [];
    loadModel();
    var faceImage;
    var rtn = "";
    fs.readdir("trainempty", function (err, files) {
        var flag = false;
        files.forEach(function (image, innerIndex) {
            if (flag) { return; }
            var trainFile = path.join("trainempty", image);
            const targetSize = 200;
            faceImage = detector.detectFaces(fr.loadImage(trainFile), targetSize);
            if (faceImage.length === 0) {
                flag = true;
                rtn = "Unable to train";
                return;
            }
            set.push(...faceImage);
            console.log(set);
        });
        try {
            recognizer.addFaces(set, singleName, numJitters);
            const modelState = recognizer.serialize();
            fs.writeFileSync('modeltest.json', JSON.stringify(modelState));
        } catch (err) {
            
        }
        callback(rtn);
    });
    return set;
}

function predict(image) {
    loadModel();
    const load = fr.loadImage(image);
    const targetSize = 200;
    var detectedFace = detector.detectFaces(load, targetSize);

    var ret;
    if (detectedFace.length < 1) {
        ret = "Unknown";
    } else {
        const bestPrediction = recognizer.predictBest(detectedFace[0]);
        if (bestPrediction.distance < 0.3) {
            ret = bestPrediction.className;
        } else {
            console.log("Test Failed");
            ret = 'Unknown';
        }

    }
    return ret;
}