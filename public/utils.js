// import { server_url } from "./constants.js";
// import { stun_servers } from "./constants.js";
// import { initiateCall } from "./index.js";

// export const store = {
//   stun_servers: [...stun_servers],
//   clients: null,
// };
// export const getUsersFromServer = async () => {
//   try {
//     const response = await fetch(server_url + "users");
//     store.clients = await response.json();
//     return true;
//   } catch (err) {
//     return false;
//   }
// };
// const updateUserName = async (id, name) => {
//   const updateUrl = server_url + "update";
//   console.log(updateUrl);
//   const x = await fetch(updateUrl, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ id, name }),
//   });
//   console.log("updated user : ", await x.json());
//   await getUsersFromServer();
// };

// export const renderUsers = async (id, nameInputValue) => {
//   const UsersEl = document.getElementById("availableUsersId");
//   const yourAccountNameEl = document.getElementById("yourAccountName");

//   await updateUserName(id, nameInputValue);

//   store.clients?.map((user) => {
//     if (id === user.id) {
//       console.log("current user", user);
//       yourAccountNameEl.textContent =
//         "Name: " + `${user?.name === null ? "Name not set yet" : user?.name}`;
//     }
//     if (id !== user.id) {
//       const userEl = document.createElement("li");
//       console.log(user?.name);
//       userEl.textContent = user?.name;
//       userEl.style.width = "max-content";
//       let color;

//       userEl.addEventListener(
//         "mouseover",
//         function () {
//           userEl.style.color = "green";
//           userEl.style.fontSize = "22px";
//           userEl.style.cursor = "pointer";
//           userEl.addEventListener("click", function () {
//             userEl.style.color = "red";
//             color = "red";
//             initiateCall();
//           });
//         },
//         false
//       );
//       userEl.addEventListener(
//         "mouseleave",
//         function () {
//           if (color === "red") {
//             userEl.style.color = "red";
//           } else {
//             userEl.style.color = "black";
//           }
//           userEl.style.fontSize = "1rem";
//           userEl.style.cursor = "none";
//         },
//         false
//       );
//       UsersEl.appendChild(userEl);
//     }
//   });
// };

// //elements update and render
