"use strict";
let AWS = require('aws-sdk');
let fs = require('fs');
require('./auth.js');

let polly = new AWS.Polly();

let params = {
   "LexiconNames": [ "boston" ],
   "OutputFormat": "mp3",
   "Text": '<speak>'+
   '<prosody volume="+4.08dB">'+
   'Lets Grab A Beer At The Square.'+
   '</prosody>'
   +'</speak>',
   "TextType": "ssml",
   "VoiceId": "Salli"
};

let synthCallback = function(err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
        //Save MP3 to S3
        var s3 = new AWS.S3({ params: { Bucket: 'boston-accent', Key: 'pollyDemo.mp3' } });
        s3.putObject({ Body: data.AudioStream, ACL: 'public-read' }, function(err, data) {
            if (err){
                console.log("error saving file to S3", err);
            } else {
                console.log("successfully saved file to S3");
            }
        });
    }
}

polly.synthesizeSpeech(params, synthCallback);