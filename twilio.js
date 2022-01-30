const http = require('http')
const fs = require('fs')
var cors = require('cors')
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var config = require('./config');
//console.log(config.accountSidTwilio);
//console.log(config.authTokenTwilio);
require ('dotenv').config({path:'./Test.env'})
//console.log(process.env.authTokenTwilio);

const admin=require('firebase-admin');

var serviceAccount = require('./admin.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://swamphack-e73fa-default-rtdb.firebaseio.com"
});

var db=admin.database();
//var userRef=db.ref("users");

var myRef = db.ref("users").push();
var key = myRef.key;





const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };
  
  app.use(cors(corsOpts));

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { 'content-type': 'text/html' })
//   fs.createReadStream('GOOGLE MAPS.html').pipe(res)
// })

// server.listen(process.env.PORT || 3002)
console.log(' called'); 


// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/endpoint',jsonParser, function(req, res){
	var obj = {};
    //console.log("hi");
	console.log('body: ' + JSON.stringify(req.body));
    //console.log(req);
    let result = req.body.msage.includes("Donuts");
    console.log(result);

    const accountSid = process.env.accountSidTwilio;
    const authToken = process.env.authTokenTwilio;
    const client = require('twilio')(accountSid, authToken);
    
    

    if (result==true){
      obj.alert = "911 ITS AN EMERGENCY";
      client.calls
      .create({
         twiml: '<Response><Say>Ahoy, World!</Say></Response>',
         to: '+13528883629',
         from: '+18106424928'
       })
      .then(call => console.log(call.sid));
    }
    // var longitude = position.coords.longitude;
    var latlongvalue = req.body.latitude + "," + req.body.longitude;
    var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlongvalue+"&zoom=14&size=400x300&key="+process.env.googlemaps;
            
    let message='latitude - '+ req.body.latitude+' longitude - '+req.body.longitude+' Map Location:' +img_url+ '      Conversation : '+req.body.msage;
    console.log(message);
    
        client.messages
        .create({
         
          body: message,
          messagingServiceSid: process.env.msgid,      
          to: '+13528883629 '
        })
        .then(message => console.log(message.sid));




      var timestamp = new Date().toISOString();
       obj.timestamp = timestamp;
       obj.latitude = req.body.latitude;
       obj.longitude = req.body.longitude;
       obj.map = img_url;
       obj.message= req.body.msage;
       
       myRef.push(obj);






	res.send(req.body);
});


function trial(){
    console.log('ss')
}

function sendSMS(message){
    console.log('functio called');
}

app.listen(3002);
//     const accountSid = 'AC6ff4f427089f8d3afccf83db8a4394e5';
// const authToken = 'ce9968f17d5eb8131a83dc42494a6193';
// const client = require('twilio')(accountSid, authToken);

//     client.messages
//     .create({
//       body: message,
//       from: '+18106424928',
//       to: '+13528883629 '
//     })
//     .then(message => console.log(message.sid));
//}






// function runPeriodic(todayTotal){
  
    
//                 //sendSMS('I might be in trouble, this is mylocation'+);
//                 sendSMS(todayTotal);
//                 console.log(todayTotal);
              
       
// }

// const DURATION = 5 * 1000;


// setInterval(runPeriodic, DURATION);

// export function createServer() {
//     throw new Error('Function not implemented.');
// }
