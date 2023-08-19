import { stun_servers } from "./constants.js";
const socket = io();

const accountIdEl = document.getElementById("accountId");

const callingEl = document.getElementById("calling");
callingEl.textContent = "Calling...";
callingEl.style.display = "none";
const ringingEl = document.getElementById("ringing");
ringingEl.textContent = "Ringing...";
ringingEl.style.display = "none";

const remoteEl = document.getElementById("remoteAudioStreamDivId");
const remoteAudioEl = document.createElement("audio");
remoteEl.appendChild(remoteAudioEl);
const localEl = document.getElementById("localAudioStreamDivId");
const localAudioEl = document.createElement("audio");
localEl.appendChild(localAudioEl);

const remoteSocketIdEl = document.getElementById("remoteId");
const startCallEl = document.getElementById("localAudioInitButtonId");
const acceptCallEl = document.getElementById("localAudioAcceptButtonId");

//peers
let localPeerConnection;
let remotePeerConnection;
const configuration = {
  iceServers:
    [
      {
        urls: "iphone-stun.strato-iphone.de:3478",
      },
    ] || stun_servers,
};
const constraints = { video: false, audio: true };

socket.on("connect", () => {
  accountIdEl.textContent = socket.id;
});

startCallEl.addEventListener("click", async () => {
  // if (remoteSocketIdEl.value === "") return;
  try {
    let streams = await window.navigator.mediaDevices.getUserMedia(constraints);
    console.log("localstream from caller", streams.getTracks());
    localPeerConnection = new RTCPeerConnection(configuration);
    callingEl.style.display = "block";

    streams.getTracks().forEach((track) => {
      localPeerConnection.addTrack(track);
    });
    let sdpOffer = await localPeerConnection.createOffer();
    await localPeerConnection.setLocalDescription(sdpOffer);
    socket.emit("offer", sdpOffer);
    socket.on("answer", async (answer) => {
      await localPeerConnection.setRemoteDescription(answer);
      callingEl.style.display = "none";
    });
    localPeerConnection.ontrack = (e) => {
      console.log("callee", e);
      remoteAudioEl.srcObject = e.streams[0];
      remoteAudioEl.play();
    };
    localPeerConnection.onicecandidate = ({ candidate }) => {
      socket.emit("candidate", candidate);
    };
  } catch (err) {
    console.log(err);
  }
});

socket.on("offer", (sdpOffer) => {
  ringingEl.style.display = "block";
  acceptCallEl.addEventListener("click", async () => {
    try {
      remotePeerConnection = new RTCPeerConnection(configuration);
      let streams = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("localstream from callee", streams.getTracks());
      await remotePeerConnection.setRemoteDescription(sdpOffer);
      const answer = await remotePeerConnection.createAnswer();
      await remotePeerConnection.setLocalDescription(answer);
      socket.emit("answer", answer);
      streams.getTracks().forEach((track) => {
        remotePeerConnection.addTrack(track);
      });
      remotePeerConnection.ontrack = function (e) {
        console.log("caller", e);
        ringingEl.style.display = "none";
        remoteAudioEl.srcObject = e.streams[0];
        remoteAudioEl.play();
      };
      remotePeerConnection.onicecandidate = ({ candidate }) => {
        socket.emit("candidate", candidate);
      };
    } catch (err) {
      console.log(err);
    }
  });
});

socket.on("candidate", async (candidate) => {
  try {
    let conn = localPeerConnection || remotePeerConnection;
    await conn?.addIceCandidate(candidate);
  } catch (err) {
    console.log(err);
  }
});
