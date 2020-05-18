const mediaStreamConstraints = {
    video: true,
};
const offerOptions = {
  offerToReceiveVideo: 1,
};

const camVideo = document.getElementById('camVideo');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let camStream;
let localStream;
let remoteStream;

let pc1;
// let pc2;


function handleSuccess(what) {
  console.log(what, ' success');
}
function handleError(what, error) {
  console.log(what, ' err', error);
}

function gotCamMediaStream(mediaStream) {
  camVideo.srcObject = mediaStream;
  camStream = mediaStream;
  console.log('Received cam stream.');
  callButton.disabled = false;  // Enable call button.
}

function gotLocalMediaStream(event) {
  const mediaStream = event.stream;
  localVideo.srcObject = mediaStream;
  localStream = mediaStream;
  console.log('received local stream.');
}

function gotRemoteMediaStream(event) {
  const mediaStream = event.stream;
  remoteVideo.srcObject = mediaStream;
  remoteStream = mediaStream;
  console.log('received remote stream.');
}

function handlepc1Connection(event) {
  // const peerConnection = event.target;
  const iceCandidate = event.candidate;

  if (iceCandidate) {

    // sendConnpc2(iceCandidate);
    console.log('ICE '+JSON.stringify(iceCandidate.toJSON()));
  }
}

// function handlepc2Connection(event) {
//   // const peerConnection = event.target;
//   const iceCandidate = event.candidate;

//   if (iceCandidate) {

//     sendConnpc1(iceCandidate);
//   }
// }

// function sendConnpc2(iceCandidate) {
//   const newIceCandidate = new RTCIceCandidate(iceCandidate);

//     // send icecandidate to other(remote/local)
//     pc2.addIceCandidate(newIceCandidate)
//       .then(() => {
//         handleSuccess('ice pc1 -> pc2');
//       }).catch((error) => {
//         handleError('ice pc1 -> pc2', error);
//       });
// }

function sendConnpc1(iceCandidate) {
  const newIceCandidate = new RTCIceCandidate(iceCandidate);

    // send icecandidate to other(remote/local)
    pc1.addIceCandidate(newIceCandidate)
      .then(() => {
        handleSuccess('ice pc2 -> pc1');
      }).catch((error) => {
        handleError('ice pc2 -> pc1', error);
      });
}


function createdOffer(description) {

  console.log('pc1 setLocalDescription start.');
  pc1.setLocalDescription(description)
    .then(() => {
      handleSuccess('pc1 desc added');
    }).catch((error) => {
      handleError('pc1 desc added', error);
    });
    // send this desc(offer) to remote

    // sendOfferpc2(description);
    console.log('OFFER '+JSON.stringify(description.toJSON()));
}

// function sendOfferpc2(description) {
//   console.log('pc2 setRemoteDescription start.');
//   pc2.addStream(camStream)
//   pc2.setRemoteDescription(description)
//     .then(() => {
//       handleSuccess('pc2 remote desc added');
//     }).catch((error) => {
//       handleError('pc2 reomte desc added', error);
//     });

//   pc2.createAnswer()
//     .then(createdAnswer)
//     .catch((error) => {
//       handleError('pc2 create ans', error);
//     });
// }

// function createdAnswer(description) {

//   console.log('pc2 setLocalDescription start.');
//   pc2.setLocalDescription(description)
//     .then(() => {
//       handleSuccess('pc2 local desc')
//     }).catch((error) =>{
//       handleError('pc2 local desc', error);
//     });

//     sendAnswerpc1(description);
// }


function sendAnswerpc1(description) {
  pc1.setRemoteDescription(description)
    .then(() => {
      handleSuccess('pc1 remote desc');
    }).catch((err) => {
      handleError('pc1 remote desc', err);
    });
}


function startCam() {
  navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    .then(gotCamMediaStream).catch((err)=>{
      handleSuccess('startCam', err);
    });
}

function call() {
  const servers = {"iceServers": [{ "url": "stun:stun.1.google.com:19302" }] };
  
  pc1 = new RTCPeerConnection(servers);
  trace('Created local peer connection object pc1.');

  pc1.addEventListener('icecandidate', handlepc1Connection);
  // pc1.addEventListener('iceconnectionstatechange', handleConnectionChange);
  


//   pc2 = new RTCPeerConnection(servers);
//   trace('Created  pc2.');

  pc1.addEventListener('addstream', gotLocalMediaStream);

//   pc2.addEventListener('icecandidate', handlepc2Connection);
  // pc2.addEventListener('iceconnectionstatechange', handleConnectionChange);
//   pc2.addEventListener('addstream', gotRemoteMediaStream);

  // Add local stream to connection and create offer to connect.
  pc1.addStream(camStream);
  trace('Added cam stream to pc1.');

  trace('pc1 createOffer start.');
  pc1.createOffer(offerOptions)
    .then(createdOffer).catch((err) => {
      handleError('pc1 crtoffer', err);
    });
}

function hangup() {
  pc1.close();
//   pc2.close();
  pc1 = null;
//   pc2 = null;
  clear();
}

function trace(x) {
  console.log(x);
}


function offans() {
    let desc = document.getElementById('desc').value.trim();
    sendAnswerpc1(new RTCSessionDescription(JSON.parse(desc)));
}

function iceCan() {
    let ice = document.getElementById('ice').value.trim();
    sendConnpc1(new RTCIceCandidate(JSON.parse(ice)));
}