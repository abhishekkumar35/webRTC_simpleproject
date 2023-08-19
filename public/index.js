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
  iceServers: stun_servers,
  iceCandidatePoolSize: 10,
};
const constraints = { audio: true };

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
    // localAudioEl.srcObject = streams;
    streams.getTracks().forEach((track) => {
      localPeerConnection.addTrack(track, streams);
    });
    let sdpOffer = await localPeerConnection.createOffer();
    await localPeerConnection.setLocalDescription(
      new RTCSessionDescription(sdpOffer)
    );
    socket.emit("offer", sdpOffer);
    socket.on("answer", async (answer) => {
      console.log("answer from remote", answer);
      await localPeerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });
    localPeerConnection.ontrack = (e) => {
      console.log("callee", e);
      remoteAudioEl.srcObject = e.streams[0];
      remoteAudioEl.play();
      callingEl.style.display = "none";
    };

    localPeerConnection.onicecandidate = ({ candidate }) => {
      console.log("l-candidate", candidate);
      socket.emit("lcandidate", candidate);
      // socket.emit("candidate", candidate);
    };

    localPeerConnection.addEventListener("iceconnectionstatechange", () => {
      if (localPeerConnection.iceConnectionState === "connected") {
        console.log("sucessfully connected");
      }
    });
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
      // console.log("localstream from callee", streams.getTracks());
      // console.log("offer from local", sdpOffer);
      streams.getTracks().forEach((track) => {
        remotePeerConnection.addTrack(track, streams);
      });

      await remotePeerConnection.setRemoteDescription(
        new RTCSessionDescription(sdpOffer)
      );
      let answer = await remotePeerConnection.createAnswer();
      await remotePeerConnection.setLocalDescription(
        new RTCSessionDescription(answer)
      );

      socket.emit("answer", answer);

      remotePeerConnection.ontrack = function (e) {
        // console.log("caller", e);
        ringingEl.style.display = "none";
        remoteAudioEl.srcObject = e.streams[0];
        remoteAudioEl.play();
      };
      remotePeerConnection.onicecandidate = ({ candidate }) => {
        // console.log("r-candidate", candidate);
        socket.emit("rcandidate", candidate);
        // socket.emit("candidate", candidate);
      };

      remotePeerConnection.addEventListener("iceconnectionstatechange", () => {
        if (remotePeerConnection.iceConnectionState === "connected") {
          console.log("sucessfully connected");
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
});

socket.on("lcandidate", async (candidate) => {
  console.log("l-candidate", candidate);
  remotePeerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
});
socket.on("rcandidate", async (candidate) => {
  console.log("r-candidate", candidate);
  localPeerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
});
// socket.on("candidate", async (candidate) => {
//   try {
//     let conn = localPeerConnection || remotePeerConnection;
//     await conn?.addIceCandidate(candidate);
//   } catch (err) {
//     console.log(err);
//   }
// });
