# Facial Recognition Electron App

Part of the design process for SUTD ISTD Term 5 ESC Project. No longer updated as we decided to not use electron.
This app so far allows the user to train a new face into the model, as well as verify the identity of a person.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Nodejs and npm
Preferably a Linux/Mac machine (I had alot of issues when running on a windows)

### Installing

A step by step series of examples that tell you have to get a development env running

Firstly, clone the repo and cd into the folder

```
$ git clone https://github.com/jQChang95/testFacial
$ cd testFacial
```

Then, run npm install to install the packages

```
$ npm install
```

And you are done. just run the following command and the app should pop up
```
$ npm start
```


## Running the tests

Run the following
```
$ npm test
```

The test runs the functions that are used for the training and predicting. As well as run on the test files instead of the main files, so rest assure your normal files will not be affected


## Built With

* [nodejs](https://nodejs.org/en/) - Main framework 
* [Electron](https://electronjs.org/) - Used to deploy the app
* [face-recognition.js](https://github.com/justadudewhohacks/face-recognition.js?files=1) - facial recognition library used

## Authors

* **Chang Jun Qing**

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.


## Acknowledgments

* Special thanks to [justadudewhohacks](https://github.com/justadudewhohacks) for the repo of the facial recognition
* Group members of my ESC project for helping out with this
