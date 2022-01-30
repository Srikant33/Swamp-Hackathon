// required dom elements
const buttonEl = document.getElementById('button');
const messageEl = document.getElementById('message');
const titleEl = document.getElementById('real-time-title');

// set initial state of application variables
messageEl.style.display = 'none';
let isRecording = false;
let socket;
let recorder;
let flag = 1;
// runs real-time transcription and handles global variables
const run = async () => {
  if (isRecording) { 
    if (socket) {
      socket.send(JSON.stringify({terminate_session: true}));
      socket.close();
      socket = null;
    }

    if (recorder) {
      recorder.pauseRecording();
      recorder = null;
    }
  } else {
    const response = await fetch('http://localhost:8000'); // get temp session token from server.js (backend)
    const data = await response.json();

    if(data.error){
      alert(data.error)
    }
    
    const { token } = data;

    // establish wss with AssemblyAI (AAI) at 16000 sample rate
    socket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

    // handle incoming messages to display transcription to the DOM
    let texts = {};
    socket.onmessage = (message) => {
      let msg =''
      const res = JSON.parse(message.data);
      texts[res.audio_start] = res.text;
      let keys = Object.keys(texts);
      keys.sort((a, b) => a - b);
      for (const key of keys) {
        if (texts[key]) {
          if (flag==0){
            console.log(msg);
            // console.log('before setting it to null');
            msg = `${texts[key]}`;  
            // console.log(msg);
            // console.log('after setting it to null');
            texts = {};
            keys=[];
            keys.length = 0
            flag=1;
            msg = `${texts[key]}`;
            // console.log('after vhanginf it ot flag');

          }
          else{
            msg += ` ${texts[key]}`;
          }
        }
      }
        // function runPeriodic(){
                                  
        // }         
        messageEl.innerText = msg;       
                
    };

    socket.onerror = (event) => {
      console.error(event);
      socket.close();
    }
    
    socket.onclose = event => {
      console.log(event);
      socket = null;
    }

    socket.onopen = () => {
      // once socket is open, begin recording
      messageEl.style.display = '';
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          recorder = new RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
            recorderType: StereoAudioRecorder,
            timeSlice: 250, // set 250 ms intervals of data that sends to AAI
            desiredSampRate: 16000,
            numberOfAudioChannels: 1, // real-time requires only one channel
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            ondataavailable: (blob) => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64data = reader.result;

                // audio data must be sent as a base64 encoded string
                if (socket) {
                  socket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                }
              };
              reader.readAsDataURL(blob);
            },
          });

          recorder.startRecording();
        })
        .catch((err) => console.error(err));
    };
  }

  isRecording = !isRecording;
  buttonEl.innerText = isRecording ? 'Stop' : 'Record';
  titleEl.innerText = isRecording ? 'Click stop to end recording!' : 'Click start to begin recording!'
};

buttonEl.addEventListener('click', () => run());




function showLocation(position){
  var latitude = position.coords.latitude;
  console.log(position.coords.latitude);
  var longitude = position.coords.longitude;
  var latlongvalue = position.coords.latitude + "," + position.coords.longitude;
  var location = {};
  location.latitude = latitude;
  location.longitude = longitude;
  location.msage= messageEl.innerText;
  // messageEl.innerText = '';
  // flag=0;
              
            
  $.ajax({
    type: 'POST',
    data: JSON.stringify(location),
        contentType: 'application/json',
                url: 'http://localhost:3002/endpoint',						
                success: function(data) {
                    console.log('success');
                    console.log(JSON.stringify(data));
                }
  });
  
} 
function errorHandler(err) {
  if(err.code == 1) {
     alert("Error: Access is denied!");
  } else if( err.code == 2) {
     alert("Error: Position is unavailable!");
  }
}
function getLocation(){
  if(navigator.geolocation){
     // timeout at 60000 milliseconds (60 seconds)
     var options = {timeout:6000};
     navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
  } else{
     alert("Sorry, browser does not support geolocation!");
  }
}


const DURATION = 20 * 1000;

// initialSetup();
// setInterval(getLocation, DURATION);

setInterval(() => {
 getLocation();
 flag=0;
}, 10000);
           