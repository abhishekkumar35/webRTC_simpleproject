const google_stun = "stun.l.google.com:19302";
const google_stun1 = "stun1.l.google.com:19302";
const google_stun2 = "stun2.l.google.com:19302";
const google_stun3 = "stun3.l.google.com:19302";
const google_stun4 = "stun4.l.google.com:19302";
const stun_servers = [
  { urls: google_stun },
  { urls: google_stun1 },
  { urls: google_stun2 },
  { urls: google_stun3 },
  { urls: google_stun4 },
];
const server_url = "http://localhost:8002/";
export { stun_servers, server_url };
