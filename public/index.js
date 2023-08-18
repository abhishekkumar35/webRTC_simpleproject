import { stun_servers } from "./constants";
const socket = io();

const accountIdEl = document.getElementById("accountId");

const remoteEl = document.getElementById("remoteAudioStreamDivId");
const localEl = document.getElementById("localAudioStreamDivId");

const remoteSocketIdEl = document.getElementById("remoteId");
const startCallEl = document.getElementById("localAudioInitButtonId");
const acceptCallEl = document.getElementById("remoteAudioInitButtonId");

//peers
let localPeerConnection;
let remotePeerConnection;
const configuration = { iceServers: [...stun_servers] };
const constraints = { video: false, audio: true };


socket.on("connect", () => {
  accountIdEl.textContent = socket.id;
});

startCallEl.addEventListener("click",async () => {
  if (remoteSocketIdEl.value === "") return;
let stream = await navigator.mediaDevices.getUserMedia(constraints)
  localPeerConnection = new RTCPeerConnection(configuration);
let sdpOffer = await localPeerConnection.createOffer()
socket.emit("offer", sdpOffer)
await localPeerConnection.setLocalDescription(sdpOffer)
socket.on("answer",(answer)=>{localPeerConnection.setRemoteDescription(answer);})
localPeerConnection.onicecandidate = ({candidate})={
socket.emit("candidate",candidate)

}

});
